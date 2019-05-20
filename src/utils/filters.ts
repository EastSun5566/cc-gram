/**
 * @module filters
 *
 * Base on CSSgram by Una Kravets
 * @see CSSgram <https://github.com/una/CSSgram>
 */

import { FilterName, FilterSetting } from './types';

const filters: Map<FilterName, FilterSetting> = new Map([
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
]);

export default filters;
