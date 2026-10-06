import {
  describe,
  beforeEach,
  it,
  expect,
} from 'vitest';

import { CCgram } from '../src';
import { parseSettingToStyle } from '../src/utils';

const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
const FILTER_NAME = '1977';

describe('Filter setting CSS', () => {
  it('omits undefined settings while preserving defined settings', () => {
    expect(parseSettingToStyle({ blur: undefined, sepia: 0.5 })).toBe('sepia(0.5)');
  });

  it('preserves zero values and their units', () => {
    expect(parseSettingToStyle({
      blur: 0,
      brightness: 0,
      sepia: 0,
      'hue-rotate': 0,
    })).toBe('blur(0px) brightness(0) sepia(0) hue-rotate(0deg)');
  });

  it('preserves the units and order of remaining settings', () => {
    expect(parseSettingToStyle({
      sepia: 0.5,
      brightness: undefined,
      'hue-rotate': -20,
      blur: 2,
      contrast: undefined,
    })).toBe('sepia(0.5) hue-rotate(-20deg) blur(2px)');
  });

  it('returns none when no settings are defined', () => {
    expect(parseSettingToStyle({ blur: undefined, sepia: undefined })).toBe('none');
    expect(parseSettingToStyle({})).toBe('none');
    expect(parseSettingToStyle()).toBe('none');
  });

  it('applies partial settings and clears the preview when all values are undefined', () => {
    const cg = new CCgram({ init: false });
    const img = document.createElement('img');
    img.dataset.filter = 'custom';
    document.body.append(img);

    try {
      cg.setFilter('custom', { blur: undefined, sepia: 0.5 });
      cg.applyFilter();
      expect(img.style.filter).toBe('sepia(0.5)');

      cg.setFilter('custom', { blur: undefined, sepia: undefined });
      cg.applyFilter();
      expect(img.style.filter).toBe('none');
    } finally {
      img.remove();
    }
  });
});

describe('Custom data attribute with kebab-case', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should apply filter with kebab-case data attr (data-my-filter)', (): void => {
    const DATA_ATTR = 'my-filter';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-${DATA_ATTR}="${FILTER_NAME}">
    `;

    const cg = new CCgram({ dataAttribute: DATA_ATTR });
    const img = document.querySelector<HTMLImageElement>(`img[data-${DATA_ATTR}="${FILTER_NAME}"]`)!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(img.style.filter);
  });

  it('should apply filter with kebab-case data attr (data-instagram-filter)', (): void => {
    const DATA_ATTR = 'instagram-filter';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-${DATA_ATTR}="${FILTER_NAME}">
    `;

    const cg = new CCgram({ dataAttribute: DATA_ATTR });
    const img = document.querySelector<HTMLImageElement>(`img[data-${DATA_ATTR}="${FILTER_NAME}"]`)!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(img.style.filter);
  });

  it('should work with single-word data attr (data-cg)', (): void => {
    const DATA_ATTR = 'cg';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-${DATA_ATTR}="${FILTER_NAME}">
    `;

    const cg = new CCgram({ dataAttribute: DATA_ATTR });
    const img = document.querySelector<HTMLImageElement>(`img[data-${DATA_ATTR}="${FILTER_NAME}"]`)!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(img.style.filter);
  });
});
