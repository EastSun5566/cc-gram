/**
 * @package cc-gram <https://github.com/EastSun5566/cc-gram>
 *
 * @license MIT
 * @copyright (c) 2019 - present
 * @author 汪東陽 EastSun5566 <https://github.com/EastSun5566>
 */

import { DEFAULT_FILTERS, FilterName, FilterSetting } from './filters';
import {
  parseSettingToStyle,
  createFilterImageCanvas,
} from './utils';

/**
 * The Options for canvas
 *
 * @interface Options
 */
interface Options {
  /**
   * MIME types, default is `image/png`
   *
   * @type {string}
   * @memberof Options
   */
  type?: string;

  /**
   * [0 - 1], default is `0.92`
   *
   * @type {number}
   * @memberof Options
   */
  quality?: number;
}

/**
 * 🖼 A CSS & Canvas Instagram filters based on CSSgram
 *
 * @class CCGram
 */
export class CCGram {
  /**
   * The default filter list
   *
   * @private
   * @memberof CCGram
   */
  private readonly _filters = DEFAULT_FILTERS;

  /**
   * Initialize CSS filter to all targets
   *
   * @constructor
   * @memberof CCGram
   */
  constructor() {
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
   *
   * @readonly
   * @type {FilterName[]}
   * @memberof CCGram
   */
  get filterNames(): FilterName[] {
    return [...this._filters.keys()];
  }

  /**
   * Add/Set filter
   *
   * @param {FilterName} name - the Filter name
   * @param {FilterSetting} setting - the Filter setting
   * @memberof CCGram
   */
  setFilter(name: FilterName, setting: FilterSetting): void {
    this._filters.set(name, setting);
  }

  /**
   * Remove filter
   *
   * @param {FilterName} name - the Filter name
   * @returns {boolean} Whether the removal was successful
   * @memberof CCGram
   */
  removeFilter(name: FilterName): boolean {
    return this._filters.delete(name);
  }

  /**
   * Get the CSS inline style of filter
   *
   * @param {FilterName} [name=''] - The filter name
   * @returns {string} filter CSS inline style
   * @memberof CCGram
   */
  getFilterStyle(name: FilterName = ''): string {
    const setting = this._filters.get(name);

    return parseSettingToStyle(setting);
  }

  /**
   * Apply CSS filter to all targets
   *
   * @param {string} [selectors='img[data-filter]'] - selectors
   * @memberof CCGram
   */
  applyFilter(selectors = 'img[data-filter]'): void {
    const targets = document.querySelectorAll<HTMLImageElement>(selectors);

    targets.forEach((target): void => {
      const { dataset: { filter } } = target;
      target.style.filter = this.getFilterStyle(filter);
    });
  }

  /**
   * Create canvas of image element
   *
   * @private
   * @param {HTMLImageElement} image
   * @returns {Promise<HTMLCanvasElement>}
   * @memberof CCGram
   */
  private _getImageCanvas(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    if (!image || image.tagName !== 'IMG') throw new Error('The first argument is required and must be an <img> element.');
    if (!image.src) throw new Error('The <img> element src attribute is empty.');

    const {
      src,
      dataset: { filter },
    } = image;

    return createFilterImageCanvas(src, this.getFilterStyle(filter));
  }

  /**
   * Get the data URL of image element
   *
   * @param {HTMLImageElement} element - image element
   * @param {Options} [options={}] - options
   * @returns {Promise<string>} data url
   * @memberof CCGram
   */
  async getDataURL(
    element: HTMLImageElement,
    { type, quality }: Options = {},
  ): Promise<string> {
    const canvas = await this._getImageCanvas(element);

    return canvas.toDataURL(type, quality);
  }

  /**
   * Get the blob of image element
   *
   * @param {HTMLImageElement} element - image element
   * @param {Options} [options={}] - options
   * @returns {(Promise<Blob | null>)} blob
   * @memberof CCGram
   */
  async getBlob(
    element: HTMLImageElement,
    { type, quality }: Options = {},
  ): Promise<Blob | null> {
    const canvas = await this._getImageCanvas(element);

    return new Promise((resolve): void => {
      canvas.toBlob((blob): void => resolve(blob), type, quality);
    });
  }
}

export default CCGram;
