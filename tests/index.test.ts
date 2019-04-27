/* eslint-disable no-undef */
import Ccgram from '../src';
import filters from '../src/utils/filters';

describe('Test instance of ccgram class', (): void => {
  const filterName = '1977';
  document.body.innerHTML = `<img data-filter="${filterName}">`;

  const ccgram = new Ccgram();

  test('Test constructor', (): void => {});

  test('Test getters', (): void => {
    expect(ccgram.filterNameList).toEqual(Array.from(filters.keys()));
  });

  test('Test applyFilter method', (): void => {
    const target: HTMLElement | null = document.querySelector(`img[data-filter="${filterName}"]`);
    if (target) expect(target.style.filter).toBe(ccgram.getFilterStyle(filterName));
  });
});
