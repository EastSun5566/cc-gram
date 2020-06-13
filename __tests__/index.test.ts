import { CCGram } from '../src';

import { DEFAULT_FILTERS } from '../src/filters';

describe('CCGram class', (): void => {
  test('get filter names list', (): void => {
    const cg = new CCGram();

    expect(cg.filterNames).toEqual([...DEFAULT_FILTERS.keys()]);
  });

  test('add filter', (): void => {
    const cg = new CCGram();
    cg.setFilter('my-filter', { saturate: 0.8 });

    expect(cg.filterNames).toContain('my-filter');
  });

  test('remove filter', (): void => {
    const cg = new CCGram();

    cg.setFilter('my-filter', { saturate: 0.8 });
    cg.removeFilter('my-filter');

    expect(cg.filterNames.includes('my-filter')).toBe(false);
  });

  test('applyFilter method', (): void => {
    const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
    const FILTER_NAME = '1977';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-filter="${FILTER_NAME}">
    `;

    const cg = new CCGram();

    const target = document.querySelector<HTMLImageElement>(`img[data-filter="${FILTER_NAME}"]`);
    if (!target) throw new Error('No target');

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(target.style.filter);
  });

  // test('getDataURL method', async (): Promise<void> => {
  //   const dataURL = await cg.getDataURL(target, { quality: 0.8 });

  //   expect(dataURL).toBeTruthy();
  // });

  // test('getDataURL method', async (): Promise<void> => {
  //   const blob = await cg.getBlob(target, { quality: 0.8 });

  //   expect(blob).toBeTruthy();
  // });
});