/* eslint-disable no-undef */
import Ccgram from '../src';
import filters from '../src/utils/filters';

describe('Test instance of ccgram class', (): void => {
  const imageSrc = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
  const filterName = '1977';
  document.body.innerHTML = `
    <img
      src="${imageSrc}"
      data-filter="${filterName}">
  `;

  const ccgram = new Ccgram();

  test('Test get filter names list', (): void => {
    expect(ccgram.filterNames).toEqual([...filters.keys()]);
  });

  test('Test Add filter', (): void => {
    ccgram.setFilter('my-filter', { saturate: 0.8 });

    expect(ccgram.filterNames).toContain('my-filter');
  });

  test('Test remove filter', (): void => {
    ccgram.removeFilter('my-filter');

    expect(ccgram.filterNames.includes('my-filter')).toBe(false);
  });

  const target: HTMLImageElement | null = document.querySelector(`img[data-filter="${filterName}"]`);
  if (!target) return;

  test('Test applyFilter method', (): void => {
    expect(ccgram.getFilterStyle(filterName)).toBe(target.style.filter);
  });
});
