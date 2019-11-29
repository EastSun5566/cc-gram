/* eslint-disable no-undef */
import CCGram from '../src';
import filters from '../src/utils/filters';

describe('Test instance of CCGram class', (): void => {
  const imageSrc = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
  const filterName = '1977';
  document.body.innerHTML = `
    <img
      src="${imageSrc}"
      data-filter="${filterName}">
  `;

  const cg = new CCGram();

  test('Test get filter names list', (): void => {
    expect(cg.filterNames).toEqual([...filters.keys()]);
  });

  test('Test Add filter', (): void => {
    cg.setFilter('my-filter', { saturate: 0.8 });

    expect(cg.filterNames).toContain('my-filter');
  });

  test('Test remove filter', (): void => {
    cg.removeFilter('my-filter');

    expect(cg.filterNames.includes('my-filter')).toBe(false);
  });

  const target: HTMLImageElement | null = document.querySelector(`img[data-filter="${filterName}"]`);
  if (!target) return;

  test('Test applyFilter method', (): void => {
    expect(cg.getFilterStyle(filterName)).toBe(target.style.filter);
  });
});
