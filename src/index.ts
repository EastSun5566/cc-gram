/**
 * @package cc-gram <https://github.com/EastSun5566/cc-gram>
 *
 * @license MIT
 * @copyright (c) 2019 - present
 * @author 汪東陽 EastSun5566 <https://github.com/EastSun5566>
 */

import { FilterName, FilterSetting, Options } from './utils/types';
import filters from './utils/filters';

/**
 * @class CCGram
 */
export default class CCGram {
  /**
   * The default filter list
   * @private
   */
  private readonly _filters = filters;

  /**
   * The image target for methods
   * @private
   */
  private _target: HTMLImageElement | null = null;

  /**
   * Initialize CSS filter to all targets
   * @constructor
   */
  public constructor() {
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

  /**
   * The filter name list
   * @readonly
   */
  public get filterNames(): FilterName[] {
    return [...this._filters.keys()];
  }

  /**
   * Add/Set filter
   * @param {string} name - the Filter name
   * @param {object} setting - the Filter setting
   */
  public setFilter(name: FilterName, setting: FilterSetting): void {
    this._filters.set(name, setting);
  }

  /**
   * Remove filter
   * @param {string} name - the Filter name
   * @returns {boolean} Whether the removal was successful
   */
  public removeFilter(name: FilterName): boolean {
    return this._filters.delete(name);
  }

  /**
   * Get the CSS inline style of filter
   * @param {string} name - The filter name
   * @returns {string} filter CSS inline style
   */
  public getFilterStyle(name: FilterName = ''): string {
    const setting = this._filters.get(name);

    if (!setting) return 'none';

    return Object
      .keys(setting)
      .map((key): string => `${key}(${setting[key]}${
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

    return new Promise((resolve, reject): void => {
      const image = new Image();

      image.onload = (): void => {
        const { width, height } = image;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { alpha: false });
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
   * Get the data url of image element
   * @param {HTMLImageElement} element - image element
   * @returns {Promise<string>} data url
   */
  public async getDataUrl(
    element: HTMLImageElement,
    { type, quality }: Options = {},
  ): Promise<string> {
    this._target = element;
    const canvas = await this.createImageCanvas();

    return canvas.toDataURL(type, quality);
  }

  /**
   * Get the blob of image element
   * @param {HTMLImageElement} element - image element
   * @returns {(Promise<Blob | null>)} blob
   */
  public async getBlob(
    element: HTMLImageElement,
    { type, quality }: Options = {},
  ): Promise<Blob | null> {
    this._target = element;
    const canvas = await this.createImageCanvas();

    return new Promise((resolve): void => {
      canvas.toBlob(
        (blob): void => resolve(blob),
        type,
        quality,
      );
    });
  }
}
