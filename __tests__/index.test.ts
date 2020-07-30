/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CCGram } from '../src';
import { DEFAULT_FILTERS } from '../src/filters';

describe('Read/Write filter list', (): void => {
  let cg: CCGram | null = null;

  beforeEach(() => { cg = new CCGram({ init: false }); });
  afterEach(() => { cg = null; });

  test('get filter names list', (): void => {
    expect(cg!.filterNames).toEqual([...DEFAULT_FILTERS.keys()]);
  });

  test('add filter', (): void => {
    cg!.setFilter('my-filter', { saturate: 0.8 });

    expect(cg!.filterNames).toContain('my-filter');
  });

  test('remove filter', (): void => {
    const { filterNames } = cg!;
    const targetFilterName = filterNames[Math.floor(Math.random() * (filterNames.length - 1))];

    cg!.removeFilter(targetFilterName);

    expect(cg!.filterNames.includes(targetFilterName)).toBe(false);
  });
});

const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
const FILTER_NAME = '1977';

const getTargetImage = (dateAttr = 'filter'): HTMLImageElement | null => (
  document.querySelector<HTMLImageElement>(`img[data-${dateAttr}="${FILTER_NAME}"]`)
);

describe('Apply filter to target Image', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  test('apply filter from init', (): void => {
    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-filter="${FILTER_NAME}">
    `;

    const cg = new CCGram();

    const { style } = getTargetImage()!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });

  test('apply filter use applyFilter method', (): void => {
    const cg = new CCGram({ init: false });

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-filter="${FILTER_NAME}">
    `;

    cg.applyFilter();

    const { style } = getTargetImage()!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });

  test('apply filter with customized data attr', (): void => {
    const DATA_ATTR = 'cg';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-${DATA_ATTR}="${FILTER_NAME}">
    `;

    const cg = new CCGram({ dataAttribute: DATA_ATTR });

    const { style } = getTargetImage(DATA_ATTR)!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });
});

describe.skip('Access filter image data', () => {
  let cg: CCGram | null = null;

  beforeEach(() => {
    document.body.innerHTML = `
        <img
          src="${IMAGE_SRC}"
          data-filter="${FILTER_NAME}">
      `;

    cg = new CCGram();
  });
  afterEach(() => {
    document.body.innerHTML = '';
    cg = null;
  });

  test('getDataURL method', async (): Promise<void> => {
    const target = getTargetImage()!;

    const dataURL = await cg!.getDataURL(target, { quality: 0.8 });

    expect(dataURL).toBeTruthy();
  });

  test('getDataURL method', async (): Promise<void> => {
    const target = getTargetImage()!;

    const blob = await cg!.getBlob(target, { quality: 0.8 });

    expect(blob).toBeTruthy();
  });
});
