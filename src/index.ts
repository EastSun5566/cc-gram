/**
 * @package cc-gram <https://github.com/EastSun5566/cc-gram>
 *
 * @license MIT
 * @copyright (c) 2019 - present
 * @author 汪東陽 EastSun5566 <https://github.com/EastSun5566>
 */

import {
  DEFAULT_FILTERS,
  FilterName,
  FilterSetting,
} from './filters';
import {
  parseSettingToStyle,
  createFilterImageCanvas,
} from './utils';

/** The parse options for canvas */
interface ParseOptions {
  /** MIME types, default is `image/png` */
  type?: string;
  /** [0 - 1], default is `0.92` */
  quality?: number;
}

/** constructor Options */
interface Options {
  /** The default data attribute */
  dataAttribute?: string;
  /** is Init CSS filter to all targets */
  init?: boolean;
}

/** 🖼 A CSS & Canvas Instagram filters based on CSSgram */
export class CCGram {
  /** default option */
  static readonly DEFAULT_DATA_ATTRIBUTE = 'filter'

  /** filter list */
  protected readonly _filters = DEFAULT_FILTERS;

  /** data attribute */
  protected _dataAttribute: string;

  /** Initialize CSS filter to all targets */
  constructor({
    dataAttribute = CCGram.DEFAULT_DATA_ATTRIBUTE,
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
   * Get setting of filter
   * @param {FilterName} [name=''] - The filter name
   */
  getFilterSetting(name: FilterName = ''): FilterSetting | void {
    return this._filters.get(name);
  }

  /**
   * Get the CSS inline style of filter
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
        target.style.filter = this.getFilterStyle(dataset[this._dataAttribute]);
      });
  }

  /**
   * Create canvas of image element
   * @param {HTMLImageElement} image
   */
  protected _getImageCanvas(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    if (!image || image.tagName !== 'IMG') throw new TypeError('The first argument is required and must be an <img> element.');
    if (!image.src) throw new TypeError('The <img> element src attribute is empty.');

    return createFilterImageCanvas(
      image,
      this.getFilterStyle(image.dataset[this._dataAttribute]),
    );
  }

  /**
   * Get the data URL of image element
   * @param {HTMLImageElement} image - image element
   * @param {ParseOptions} [parseOptions={}] - options
   */
  async getDataURL(
    image: HTMLImageElement,
    { type, quality }: ParseOptions = {},
  ): Promise<string> {
    const canvas = await this._getImageCanvas(image);

    return canvas.toDataURL(type, quality);
  }

  /**
   * Get the blob of image element
   * @param {HTMLImageElement} image - image element
   * @param {ParseOptions} [parseOptions={}] - options
   */
  async getBlob(
    image: HTMLImageElement,
    { type, quality }: ParseOptions = {},
  ): Promise<Blob | null> {
    const canvas = await this._getImageCanvas(image);

    return new Promise((resolve): void => {
      canvas.toBlob((blob): void => resolve(blob), type, quality);
    });
  }
}

export default CCGram;
