import { describe, expect, it } from 'vitest';

import { createFilter } from '../src';

// CSSgram filter declarations, excluding pseudo-element overlays:
// https://github.com/una/CSSgram/blob/6f21810aa154db57ce9436fea4d2b0b816346d4d/source/css/cssgram.css
const CSSGRAM_FILTERS = [
  ['aden', 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)'],
  ['inkwell', 'sepia(0.3) contrast(1.1) brightness(1.1) grayscale(1)'],
  ['reyes', 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)'],
  ['gingham', 'brightness(1.05) hue-rotate(-10deg)'],
  ['toaster', 'contrast(1.5) brightness(0.9)'],
  ['walden', 'brightness(1.1) hue-rotate(-10deg) sepia(0.3) saturate(1.6)'],
  ['hudson', 'brightness(1.2) contrast(0.9) saturate(1.1)'],
  ['earlybird', 'contrast(0.9) sepia(0.2)'],
  ['mayfair', 'contrast(1.1) saturate(1.1)'],
  ['lofi', 'saturate(1.1) contrast(1.5)'],
  ['1977', 'contrast(1.1) brightness(1.1) saturate(1.3)'],
  ['brooklyn', 'contrast(0.9) brightness(1.1)'],
  ['xpro2', 'sepia(0.3)'],
  ['nashville', 'sepia(0.2) contrast(1.2) brightness(1.05) saturate(1.2)'],
  ['lark', 'contrast(0.9)'],
  ['moon', 'grayscale(1) contrast(1.1) brightness(1.1)'],
  ['clarendon', 'contrast(1.2) saturate(1.35)'],
  ['willow', 'grayscale(0.5) contrast(0.95) brightness(0.9)'],
  ['rise', 'brightness(1.05) sepia(0.2) contrast(0.9) saturate(0.9)'],
  ['slumber', 'saturate(0.66) brightness(1.05)'],
  ['brannan', 'sepia(0.5) contrast(1.4)'],
  ['valencia', 'contrast(1.08) brightness(1.08) sepia(0.08)'],
  ['maven', 'sepia(0.25) brightness(0.95) contrast(0.95) saturate(1.5)'],
  ['stinson', 'contrast(0.75) saturate(0.85) brightness(1.15)'],
] as const;

describe('CSSgram preset compatibility', () => {
  it.each(CSSGRAM_FILTERS)('matches the values and order of %s', (name, style) => {
    const filter = createFilter({ init: false });

    expect(filter.getFilterStyle(name)).toBe(style);
  });

  it.each(['custom', 'maven'])('preserves custom setting order for %s', (name) => {
    const filter = createFilter({ init: false });

    filter.setFilter(name, { brightness: 0.95, contrast: 0.95 });
    expect(filter.getFilterStyle(name)).toBe('brightness(0.95) contrast(0.95)');

    filter.setFilter(name, { contrast: 0.95, brightness: 0.95 });
    expect(filter.getFilterStyle(name)).toBe('contrast(0.95) brightness(0.95)');
  });
});
