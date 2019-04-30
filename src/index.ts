/**
 * @license MIT
 * @copyright (c) 2019 - present
 * @author 汪東陽 EastSun5566
 */

import filters from './utils/filters';

class Ccgram {
  /**
   * The default filter list
   */
  private _filters = filters;

  /**
   * The image target for methods
   */
  private _target: HTMLImageElement | null = null;

  /**
   * Initalize CSS filter to all targets
   * @constructor
   */
  public constructor() {
    if (document.readyState === 'complete') {
      this.applyFilter();
      return;
    }

    document.addEventListener('DOMContentLoaded', this.applyFilter);
  }

  /**
   * The filter name list
   * @readonly
   */
  public get filterNameList(): string[] {
    return Array.from(this._filters.keys());
  }

  /**
   * Get the CSS inline style of filter
   * @param {string} [filterName=''] - The filter name
   * @returns {string} filter CSS inline style
   */
  public getFilterStyle(filterName: string = ''): string {
    const filterSetting = this._filters.get(filterName);

    if (!filterSetting) return 'none';

    return Object
      .keys(filterSetting)
      .map((key): string => `${key}(${filterSetting[key]}${
        key === 'hue-rotate'
          ? 'deg'
          : key === 'blur'
            ? 'px'
            : ''
      })`)
      .join(' ');
  }

  /**
   * Apply CSS filter to all targets
   */
  public applyFilter(): void {
    const targets: NodeListOf<HTMLImageElement> = document.querySelectorAll('img[data-filter]');

    targets.forEach((target): void => {
      const { dataset: { filter } } = target;
      target.style.filter = this.getFilterStyle(filter);
    });
  }

  /**
   * Create canvas of image target
   * @returns {Promise<HTMLCanvasElement>}
   */
  private createImageCanvas(): Promise<HTMLCanvasElement> {
    const { _target } = this;
    if (!_target || _target.tagName !== 'IMG') throw new Error('The first argument is required and must be an <img> element.');

    const {
      src,
      dataset: { filter },
    } = _target;

    if (!src) throw new Error('The <img> element src attribute is empty.');
    if (!filter) throw new Error('The <img> element data-filter attribute is empty.');

    return new Promise((resolve, reject): void => {
      const image = new Image();

      image.onload = (): void => {
        const { width, height } = image;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('The 2d context canvas is not supported.'));
          return;
        }

        ctx.filter = this.getFilterStyle(filter);
        ctx.drawImage(image, 0, 0);

        resolve(canvas);
      };

      image.onerror = (error): void => reject(error);

      image.crossOrigin = 'anonymous';
      image.src = src;
    });
  }

  /**
   * Get the data url of image elment
   * @param {HTMLImageElement} elment - image elment
   * @returns {Promise<string>} data url
   */
  public async getDataUrl(elment: HTMLImageElement): Promise<string> {
    this._target = elment;
    const canvas = await this.createImageCanvas();

    return canvas.toDataURL();
  }

  /**
   * Get the blob of image elment
   * @param {HTMLImageElement} elment - image elment
   * @returns {(Promise<Blob | null>)} blob
   */
  public async getBlob(elment: HTMLImageElement): Promise<Blob | null> {
    this._target = elment;
    const canvas = await this.createImageCanvas();

    return new Promise((resolve): void => {
      canvas.toBlob((blob): void => resolve(blob));
    });
  }

  /**
   * Download the image elment
   * @param {HTMLImageElement} elment - image elment
   * @returns {Promise<void>}
   */
  public async download(elment: HTMLImageElement): Promise<void> {
    const dataUrl = await this.getDataUrl(elment);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = elment.dataset.filter || 'Image';
    a.click();
  }
}

export default Ccgram;
