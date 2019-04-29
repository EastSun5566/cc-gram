/* eslint-disable no-undef */
import Ccgram from '../src';
import filters from '../src/utils/filters';

describe('Test instance of ccgram class', (): void => {
  const imageSrc = 'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg';
  const filterName = '1977';
  document.body.innerHTML = `
    <img
      src="${imageSrc}"
      data-filter="${filterName}">
  `;

  const ccgram = new Ccgram();

  test('Test constructor', (): void => {});

  test('Test getters', (): void => {
    expect(ccgram.filterNameList).toEqual(Array.from(filters.keys()));
  });

  const target: HTMLImageElement | null = document.querySelector(`img[data-filter="${filterName}"]`);
  if (!target) return;

  test('Test applyFilter method', (): void => {
    expect(ccgram.getFilterStyle(filterName)).toBe(target.style.filter);
  });

  // test('Test getDataUrl method', async (): Promise<void> => {
  //   const dataUrl = await ccgram.getDataUrl(target);
  // });
});
