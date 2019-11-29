/**
 * @module types
 */

/** The Name Filter */
export type FilterName = string;

/** The Setting of Filter */
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

export interface Options {
  type?: string;
  quality?: number;
}
