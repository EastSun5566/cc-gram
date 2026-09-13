import {
  DEFAULT_FILTERS,
  type FilterName,
  type FilterSetting,
} from './filters';
import {
  parseSettingToStyle,
  hasOffscreenCanvas,
  assertIsImage,
  createWorker,
  createBlobWorker,
  camelize,
} from './utils';

import type { Options, ParseOptions, WorkerResult } from './types';

export const DEFAULT_DATA_ATTRIBUTE = 'filter';

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const isWorkerResult = (value: unknown): value is WorkerResult<Blob | null> => {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;

  if (value.ok) return value.value === null || value.value instanceof Blob;

  return isRecord(value.error)
    && typeof value.error.name === 'string'
    && typeof value.error.message === 'string';
};

const createWorkerError = (event: ErrorEvent): Error => {
  const details = isRecord(event.error) ? event.error : {};
  const error = new Error(
    typeof details.message === 'string'
      ? details.message
      : event.message || '[CCgram] The image Worker failed.',
  );
  error.name = typeof details.name === 'string' ? details.name : 'Error';
  return error;
};

const renderOnMainThread = (
  image: HTMLImageElement,
  naturalWidth: number,
  naturalHeight: number,
  filterStyle: string,
  options: ParseOptions,
): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('The 2d context canvas is not supported.');

  ctx.filter = filterStyle;
  ctx.drawImage(image, 0, 0);

  const { type, quality } = options;
  return new Promise((resolve) => canvas.toBlob((blob): void => resolve(blob), type, quality));
};

/** 🖼 A CSS & Canvas Instagram filters based on CSSgram */
export class CCgram {
  static readonly DEFAULT_DATA_ATTRIBUTE = DEFAULT_DATA_ATTRIBUTE;

  static readonly DEFAULT_FILTERS = DEFAULT_FILTERS;

  /** filter list */
  protected readonly _filters = new Map(
    [...DEFAULT_FILTERS.entries()].map(([name, setting]) => [name, { ...setting }]),
  );

  /** data attribute */
  protected _dataAttribute: string;

  /** data attribute key in camelCase for dataset access */
  protected _dataAttributeKey: string;

  /** Initialize CSS filter to all targets */
  constructor({
    dataAttribute = DEFAULT_DATA_ATTRIBUTE,
    init = true,
  }: Options = {}) {
    this._dataAttribute = dataAttribute;
    this._dataAttributeKey = camelize(dataAttribute);

    if (!init) return;

    if (document.readyState !== 'loading') {
      this.applyFilter();
      return;
    }

    const handleLoaded = (): void => {
      this.applyFilter();
    };
    document.addEventListener('DOMContentLoaded', handleLoaded, { once: true });
  }

  /** The filter name list */
  get filterNames(): FilterName[] {
    return [...this._filters.keys()];
  }

  /**
   * Add/Set filter
   * @param name - the Filter name
   * @param setting - the Filter setting
   */
  setFilter(name: FilterName, setting: FilterSetting): void {
    this._filters.set(name, setting);
  }

  /**
   * Remove filter
   * @param name - the Filter name
   */
  removeFilter(name: FilterName): boolean {
    return this._filters.delete(name);
  }

  /**
   * Get setting object of filter
   * @param [name=''] - The filter name
   */
  getFilterSetting(name: FilterName = ''): FilterSetting | void {
    return this._filters.get(name);
  }

  /**
   * Get the CSS inline style string of filter
   * @param [name=''] - The filter name
   */
  getFilterStyle(name: FilterName = ''): string {
    const setting = this._filters.get(name);

    return parseSettingToStyle(setting);
  }

  /**
   * Apply CSS filter to all targets
   * @param [selectors='img[data-${this._dataAttribute}]'] - selectors
   */

  applyFilter(selectors: string = `img[data-${this._dataAttribute}]`): void {
    document
      .querySelectorAll<HTMLImageElement>(selectors)
      .forEach((target): void => {
        const { dataset } = target;
        target.style.setProperty('filter', this.getFilterStyle(dataset[this._dataAttributeKey]));
      });
  }

  /**
   * Get the data URL of image element
   * @param image - image element
   * @param [options] - options
   */
  async getDataURL(
    image: HTMLImageElement,
    options: ParseOptions = {},
  ): Promise<string | null> {
    assertIsImage(image);

    // don't use canvas.toDataURL, use blob to DataURL
    const blob = await this.getBlob(image, options);
    if (!blob) return null;

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      let cleanup = (): void => {};
      const handleLoad = (): void => {
        cleanup();
        resolve(reader.result as string);
      };
      const handleError = (): void => {
        cleanup();
        reject(reader.error ?? new Error('[CCgram] The image data could not be read.'));
      };
      const handleAbort = (): void => {
        cleanup();
        reject(new Error('[CCgram] Reading the image data was aborted.'));
      };
      cleanup = (): void => {
        reader.removeEventListener('load', handleLoad);
        reader.removeEventListener('error', handleError);
        reader.removeEventListener('abort', handleAbort);
      };

      reader.addEventListener('load', handleLoad);
      reader.addEventListener('error', handleError);
      reader.addEventListener('abort', handleAbort);

      try {
        reader.readAsDataURL(blob);
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
  }

  /**
   * Get the blob of image element
   * @param image - image element
   * @param [options={}] - parse options
   */
  async getBlob(
    image: HTMLImageElement,
    options: ParseOptions = {},
  ): Promise<Blob | null> {
    assertIsImage(image);

    try {
      if (!image.complete) await image.decode();
      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) throw new Error();
    } catch {
      throw new Error('[CCgram] The image could not be decoded.');
    }

    const { naturalWidth, naturalHeight } = image;
    const filterName = options.filter ?? image.dataset[this._dataAttributeKey];
    const filterStyle = this.getFilterStyle(filterName);

    if (hasOffscreenCanvas) {
      const canvas = new OffscreenCanvas(naturalWidth, naturalHeight);
      const bmp = await createImageBitmap(image);

      let worker: Worker;
      try {
        worker = createWorker(createBlobWorker);
      } catch {
        bmp.close();
        return renderOnMainThread(image, naturalWidth, naturalHeight, filterStyle, options);
      }

      return new Promise((resolve, reject) => {
        let settled = false;
        let cleanup = (): boolean => false;

        const handleMessage = ({ data }: MessageEvent<unknown>): void => {
          if (!cleanup()) return;

          if (!isWorkerResult(data)) {
            reject(new Error('[CCgram] The image Worker returned an invalid response.'));
            return;
          }

          if (data.ok) {
            resolve(data.value);
            return;
          }

          const error = new Error(data.error.message);
          error.name = data.error.name;
          reject(error);
        };

        const handleError = (event: ErrorEvent): void => {
          if (!cleanup()) return;
          reject(createWorkerError(event));
        };

        const handleMessageError = (): void => {
          if (!cleanup()) return;
          reject(new Error('[CCgram] The image Worker response could not be decoded.'));
        };
        cleanup = (): boolean => {
          if (settled) return false;
          settled = true;
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
          worker.removeEventListener('messageerror', handleMessageError);
          worker.terminate();
          return true;
        };

        worker.addEventListener('message', handleMessage);
        worker.addEventListener('error', handleError);
        worker.addEventListener('messageerror', handleMessageError);

        try {
          worker.postMessage({
            canvas,
            image: bmp,
            filterStyle,
            options,
          }, [canvas, bmp]);
        } catch (error) {
          bmp.close();
          if (cleanup()) reject(error);
        }
      });
    }

    return renderOnMainThread(image, naturalWidth, naturalHeight, filterStyle, options);
  }
}

/** old Name, alias for `CCgram` */
export const CCGram = CCgram;
/** alias for `CCgram` */
export const Filter = CCgram;

export type FilterInstance = InstanceType<typeof CCgram>;
export function createFilter(options: Options = {}): FilterInstance {
  return new Filter(options);
}
