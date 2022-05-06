import {
  DEFAULT_FILTERS,
  FilterName,
  FilterSetting,
} from './filters';
import {
  parseSettingToStyle,
  hasOffscreenCanvas,
  assertIsImage,
  createWorker,
  createBlobWorker,
} from './utils';

import { Options, ParseOptions } from './types';

export const DEFAULT_DATA_ATTRIBUTE = 'filter';

/** 🖼 A CSS & Canvas Instagram filters based on CSSgram */
export class CCgram {
  static readonly DEFAULT_DATA_ATTRIBUTE = DEFAULT_DATA_ATTRIBUTE

  static readonly DEFAULT_FILTERS = DEFAULT_FILTERS

  /** filter list */
  protected readonly _filters = DEFAULT_FILTERS;

  /** data attribute */
  protected _dataAttribute: string;

  /** Initialize CSS filter to all targets */
  constructor({
    dataAttribute = DEFAULT_DATA_ATTRIBUTE,
    init = true,
  }: Options = {}) {
    this._dataAttribute = dataAttribute;

    if (!init) return;

    if (document.readyState === 'complete') {
      this.applyFilter();
      return;
    }

    const handleLoaded = (): void => {
      this.applyFilter();
      document.removeEventListener('DOMContentLoaded', handleLoaded);
    };
    document.addEventListener('DOMContentLoaded', handleLoaded);
  }

  /** The filter name list */
  get filterNames(): FilterName[] {
    return [...this._filters.keys()];
  }

  /**
   * Add/Set filter
   * @param {FilterName} name - the Filter name
   * @param {FilterSetting} setting - the Filter setting
   */
  setFilter(name: FilterName, setting: FilterSetting): void {
    this._filters.set(name, setting);
  }

  /**
   * Remove filter
   * @param {FilterName} name - the Filter name
   */
  removeFilter(name: FilterName): boolean {
    return this._filters.delete(name);
  }

  /**
   * Get setting object of filter
   * @param {FilterName} [name=''] - The filter name
   */
  getFilterSetting(name: FilterName = ''): FilterSetting | void {
    return this._filters.get(name);
  }

  /**
   * Get the CSS inline style string of filter
   * @param {FilterName} [name=''] - The filter name
   */
  getFilterStyle(name: FilterName = ''): string {
    const setting = this._filters.get(name);

    return parseSettingToStyle(setting);
  }

  /**
   * Apply CSS filter to all targets
   * @param {string} [selectors='img[data-${this._dataAttribute}]'] - selectors
   */
  applyFilter(selectors = `img[data-${this._dataAttribute}]`): void {
    document
      .querySelectorAll<HTMLImageElement>(selectors)
      .forEach((target): void => {
        const { dataset } = target;
        target.style.setProperty('filter', this.getFilterStyle(dataset[this._dataAttribute]));
      });
  }

  /**
   * Get the data URL of image element
   * @param {HTMLImageElement} image - image element
   * @param {ParseOptions} [options] - options
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

    return new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      });

      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get the blob of image element
   * @param {HTMLImageElement} image - image element
   * @param {ParseOptions} [parseOptions={}] - options
   */
  async getBlob(
    image: HTMLImageElement,
    options: ParseOptions = {},
  ): Promise<Blob | null> {
    assertIsImage(image);

    const { naturalWidth, naturalHeight } = image;
    const filterStyle = this.getFilterStyle(image.dataset[this._dataAttribute]);

    if (hasOffscreenCanvas) {
      const canvas = new OffscreenCanvas(naturalWidth, naturalHeight);
      const bmp = await createImageBitmap(image);

      return new Promise((resolve) => {
        const worker = createWorker(createBlobWorker);

        worker.addEventListener('message', ({ data }: MessageEvent<Blob>) => {
          resolve(data);
          worker.terminate();
        });

        worker.postMessage({
          canvas,
          image: bmp,
          filterStyle,
          options,
        }, [canvas, bmp]);
      });
    }

    const canvas = document.createElement('canvas');
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('The 2d context canvas is not supported.');

    ctx.filter = filterStyle;
    ctx.drawImage(image, 0, 0);

    const { type, quality } = options;
    return new Promise((resolve) => canvas.toBlob((blob): void => resolve(blob), type, quality));
  }
}
