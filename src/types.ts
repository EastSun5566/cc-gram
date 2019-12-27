/**
 * @module types
 */

/**
 * The Name of Filter
 *
 * @type {string}
 */
export type FilterName = string;

/**
 * The Setting of Filter
 *
 * @interface FilterSetting
 */
export interface FilterSetting {
  blur?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  'hue-rotate'?: number;
  invert?: number;
  saturate?: number;
  sepia?: number;
  [key: string]: number | undefined;
}

/**
 * The Options for canvas
 *
 * @interface Options
 */
export interface Options {
  type?: string;
  quality?: number;
}
