import {
  describe,
  beforeEach,
  it,
  expect,
} from 'vitest';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CCgram } from '../src';

const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
const FILTER_NAME = '1977';

describe('Custom data attribute with kebab-case', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

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
