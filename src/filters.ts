/**
 * Base on CSSgram by Una Kravets
 * @see CSSgram {@link https://github.com/una/CSSgram}
 */

/** The Name of Filter */
export type FilterName = string;

/** The Setting object of Filter */
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

/** The default Filter List */
export const DEFAULT_FILTERS: Map<FilterName, FilterSetting> = new Map([
  [
    'aden',
    {
      'hue-rotate': -20,
      contrast: 0.9,
      brightness: 1.2,
      saturate: 0.85,
    },
  ],
  [
    'inkwell',
    {
      sepia: 0.3,
      contrast: 1.1,
      brightness: 1.1,
      grayscale: 1,
    },
  ],
  [
    'reyes',
    {
      sepia: 0.22,
      contrast: 0.85,
      brightness: 1.1,
      saturate: 0.75,
    },
  ],
  [
    'gingham',
    {
      'hue-rotate': -10,
      brightness: 1.05,
    },
  ],
  [
    'toaster',
    {
      contrast: 1.5,
      brightness: 0.9,
    },
  ],
  [
    'walden',
    {
      'hue-rotate': -10,
      brightness: 1.1,
      sepia: 0.3,
      saturate: 1.6,
    },
  ],
  [
    'hudson',
    {
      brightness: 1.2,
      contrast: 0.9,
      saturate: 1.1,
    },
  ],
  [
    'earlybird',
    {
      contrast: 0.9,
      sepia: 0.2,
    },
  ],
  [
    'mayfair',
    {
      contrast: 1.1,
      saturate: 1.1,
    },
  ],
  [
    'lofi',
    {
      contrast: 1.5,
      saturate: 1.1,
    },
  ],
  [
    '1977',
    {
      contrast: 1.1,
      brightness: 1.1,
      saturate: 1.3,
    },
  ],
  [
    'brooklyn',
    {
      contrast: 0.9,
      brightness: 1.1,
    },
  ],
  [
    'xpro2',
    {
      sepia: 0.3,
    },
  ],
  [
    'nashville',
    {
      contrast: 1.2,
      brightness: 1.05,
      saturate: 1.2,
      sepia: 0.2,
    },
  ],
  [
    'lark',
    {
      contrast: 0.9,
    },
  ],
  [
    'moon',
    {
      brightness: 1.1,
      contrast: 1.1,
      grayscale: 1,
    },
  ],
  [
    'clarendon',
    {
      contrast: 1.2,
      saturate: 1.35,
    },
  ],
  [
    'willow',
    {
      contrast: 0.95,
      brightness: 0.9,
      grayscale: 0.5,
    },
  ],
  [
    'rise',
    {
      contrast: 0.9,
      brightness: 1.05,
      sepia: 0.2,
      saturate: 0.9,
    },
  ],
  [
    'slumber',
    {
      brightness: 1.05,
      saturate: 0.66,
    },
  ],
  [
    'brannan',
    {
      contrast: 1.4,
      sepia: 0.5,
    },
  ],
  [
    'valencia',
    {
      contrast: 1.08,
      brightness: 1.08,
      sepia: 0.08,
    },
  ],
  [
    'maven',
    {
      contrast: 0.95,
      brightness: 1.95,
      saturate: 1.5,
      sepia: 0.25,
    },
  ],
  [
    'stinson',
    {
      contrast: 0.75,
      brightness: 1.15,
      saturate: 0.85,
    },
  ],
  [
    'amaro',
    {
      'hue-rotate': -10,
      contrast: 0.9,
      brightness: 1.1,
      saturate: 1.5,
    },
  ],
  [
    'pink',
    {
      contrast: 1.1,
      brightness: 2.1,
      saturate: 1.3,
    },
  ],
  [
    'vesper',
    {
      'hue-rotate': -10,
      contrast: 0.9,
      saturate: 0.9,
      brightness: 1.3,
      sepia: 0.1,
    },
  ],
  [
    'sierra',
    {
      contrast: 0.8,
      brightness: 0.9,
      saturate: 1,
    },
  ],
  [
    'helena',
    {
      'hue-rotate': -18,
      sepia: 0.3,
      saturate: 1.3,
    },
  ],
  [
    'ginza',
    {
      sepia: 0.2,
      contrast: 1.2,
      brightness: 1.05,
      saturate: 1.2,
    },
  ],
  [
    'juno',
    {
      contrast: 1.25,
      saturate: 1.1,
      grayscale: 0.19,
    },
  ],
  [
    'skyline',
    {
      brightness: 1.2,
      contrast: 1.1,
    },
  ],
  [
    'ludwig',
    {
      saturate: 0.8,
      contrast: 1.15,
      grayscale: 0.25,
    },
  ],
  [
    'hefe',
    {
      contrast: 1.3,
      sepia: 0.3,
      saturate: 1.3,
      'hue-rotate': -10,
      brightness: 0.95,
    },
  ],
  [
    'dogpatch',
    {
      contrast: 1.38,
      saturate: 0.85,
      brightness: 1.08,
    },
  ],
  [
    'kelvin',
    {
      sepia: 0.4,
      saturate: 2.4,
      brightness: 1.3,
      contrast: 1,
    },
  ],
  [
    'sutro',
    {
      brightness: 0.75,
      contrast: 1.3,
      sepia: 0.5,
      'hue-rotate': -25,
    },
  ],
  [
    'ashby',
    {
      contrast: 0.78,
      brightness: 1.1,
      saturate: 1.3,
      sepia: 0.12,
    },
  ],
  [
    'crema',
    {
      brightness: 0.9,
      saturate: 1.05,
      contrast: 1.1,
      'hue-rotate': 10,
    },
  ],
]);
