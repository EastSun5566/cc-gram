// @ts-nocheck
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CCgram } from '../src';
import { DEFAULT_FILTERS } from '../src/filters';

describe('Read/Write filter list', (): void => {
  let cg: CCgram | null = null;

  beforeEach(() => { cg = new CCgram({ init: false }); });

  it('should get all filter name', (): void => {
    expect(cg!.filterNames).toEqual([...DEFAULT_FILTERS.keys()]);
  });

  it('should add filter', (): void => {
    cg!.setFilter('my-filter', { saturate: 0.8 });

    expect(cg!.filterNames).toContain('my-filter');
  });

  it('should remove filter', (): void => {
    const { filterNames } = cg!;
    const targetFilterName = filterNames[Math.floor(Math.random() * (filterNames.length - 1))]!;

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
  beforeEach(() => { document.body.innerHTML = ''; });

  it('should apply CSS filter when init', (): void => {
    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-filter="${FILTER_NAME}">
    `;

    const cg = new CCgram();
    const { style } = getTargetImage()!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });

  it('should apply CSS filter when call applyFilter method', (): void => {
    const cg = new CCgram({ init: false });

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-filter="${FILTER_NAME}">
    `;

    cg.applyFilter();
    const { style } = getTargetImage()!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });

  it(' should apply filter with customized data attr', (): void => {
    const DATA_ATTR = 'cg';

    document.body.innerHTML = `
      <img
        src="${IMAGE_SRC}"
        data-${DATA_ATTR}="${FILTER_NAME}">
    `;

    const cg = new CCgram({ dataAttribute: DATA_ATTR });
    const { style } = getTargetImage(DATA_ATTR)!;

    expect(cg.getFilterStyle(FILTER_NAME)).toBe(style.filter);
  });
});

describe.skip('Access filter image data', () => {
  let cg: CCgram | null = null;

  beforeEach(() => {
    document.body.innerHTML = `
        <img
          src="${IMAGE_SRC}"
          data-filter="${FILTER_NAME}">
      `;

    cg = new CCgram();
  });

  it('should return dataURL when call getDataURL method', async (): Promise<void> => {
    const target = getTargetImage()!;
    const dataURL = await cg!.getDataURL(target, { quality: 0.8 });

    const regEx = /data:([\w/+]+);(charset=[\w-]+|base64).*,([a-zA-Z0-9+/]+={0,2})/;
    expect(regEx.test(dataURL!)).toBe(true);
  });

  it('should return blob when call getBlob method', async (): Promise<void> => {
    const target = getTargetImage()!;
    const blob = await cg!.getBlob(target, { quality: 0.8 });

    expect(blob instanceof Blob).toBe(true);
  });
});
