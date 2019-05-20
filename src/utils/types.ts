/**
 * @module types
 */

export type FilterName = string;

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
