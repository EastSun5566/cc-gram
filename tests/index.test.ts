/* eslint-disable no-undef */
import { CCGram } from '../src';

import { DEFAULT_FILTERS } from '../src/filters';

describe('CCGram class', (): void => {
  const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
  const FILTER_NAME = '1977';

  document.body.innerHTML = `
    <img
      src="${IMAGE_SRC}"
      data-filter="${FILTER_NAME}">
  `;

  const cg = new CCGram();

  test('Get filter names list', (): void => {
    expect(cg.filterNames).toEqual([...DEFAULT_FILTERS.keys()]);
  });

  test('Add filter', (): void => {
    cg.setFilter('my-filter', { saturate: 0.8 });

    expect(cg.filterNames).toContain('my-filter');
  });

  test('remove filter', (): void => {
    cg.removeFilter('my-filter');

    expect(cg.filterNames.includes('my-filter')).toBe(false);
  });

  // const target: HTMLImageElement | null = document.querySelector(`img[data-filter="${filterName}"]`);
  // if (!target) return;

  // test('Test applyFilter method', (): void => {
  //   expect(cg.getFilterStyle(FILTER_NAME)).toBe(target.style.filter);
  // });
});
