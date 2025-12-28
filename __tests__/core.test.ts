import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  vi,
} from 'vitest';

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

  it('should get filter setting for existing filter', (): void => {
    cg!.setFilter('test-filter', { brightness: 1.2, contrast: 1.1 });
    const setting = cg!.getFilterSetting('test-filter');

    expect(setting).toEqual({ brightness: 1.2, contrast: 1.1 });
  });

  it('should return undefined for non-existent filter', (): void => {
    const setting = cg!.getFilterSetting('non-existent-filter');

    expect(setting).toBeUndefined();
  });

  it('should get filter style for existing filter', (): void => {
    cg!.setFilter('custom-filter', { sepia: 0.5 });
    const style = cg!.getFilterStyle('custom-filter');

    expect(style).toBe('sepia(0.5)');
  });

  it('should return "none" for empty filter name', (): void => {
    const style = cg!.getFilterStyle('');

    expect(style).toBe('none');
  });

  it('should update existing filter with setFilter', (): void => {
    cg!.setFilter('update-test', { grayscale: 0.5 });
    cg!.setFilter('update-test', { grayscale: 0.8 });
    const setting = cg!.getFilterSetting('update-test');

    expect(setting).toEqual({ grayscale: 0.8 });
  });

  it('should return false when removing non-existent filter', (): void => {
    const result = cg!.removeFilter('non-existent-filter');

    expect(result).toBe(false);
  });

  it('should return true when removing existing filter', (): void => {
    cg!.setFilter('temp-filter', { blur: 5 });
    const result = cg!.removeFilter('temp-filter');

    expect(result).toBe(true);
    expect(cg!.filterNames).not.toContain('temp-filter');
  });
});

const IMAGE_SRC = 'https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif';
const FILTER_NAME = '1977';
const DATA_URL_REGEX = /data:([\w/+]+);(charset=[\w-]+|base64).*,([a-zA-Z0-9+/]+={0,2})/;

const getTargetImage = (dataAttr = 'filter'): HTMLImageElement | null => (
  document.querySelector<HTMLImageElement>(`img[data-${dataAttr}="${FILTER_NAME}"]`)
);

// Helper to intentionally provide an invalid "image" element for testing.
// Uses explicit type assertion to test runtime validation with an element
// TypeScript would normally reject at compile time.
const createInvalidImageElement = (): HTMLImageElement => (
  document.createElement('div') as unknown as HTMLImageElement
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

  it('should apply filter to multiple images', (): void => {
    document.body.innerHTML = `
      <img src="${IMAGE_SRC}" data-filter="1977">
      <img src="${IMAGE_SRC}" data-filter="aden">
      <img src="${IMAGE_SRC}" data-filter="brooklyn">
    `;

    const cg = new CCgram();
    const images = document.querySelectorAll<HTMLImageElement>('img[data-filter]');

    expect(images.length).toBe(3);
    images.forEach((img) => {
      const filterName = img.dataset.filter!;
      expect(img.style.filter).toBe(cg.getFilterStyle(filterName));
    });
  });

  it('should apply filter with custom selector', (): void => {
    document.body.innerHTML = `
      <img src="${IMAGE_SRC}" class="filtered" data-filter="${FILTER_NAME}">
      <img src="${IMAGE_SRC}" data-filter="aden">
    `;

    const cg = new CCgram({ init: false });
    cg.applyFilter('img.filtered[data-filter]');

    const filteredImg = document.querySelector<HTMLImageElement>('img.filtered')!;
    const normalImg = document.querySelectorAll<HTMLImageElement>('img')[1]!;

    expect(filteredImg.style.filter).toBe(cg.getFilterStyle(FILTER_NAME));
    expect(normalImg.style.filter).toBe('');
  });

  it('should handle applyFilter when no matching elements exist', (): void => {
    document.body.innerHTML = '<div>No images here</div>';

    const cg = new CCgram({ init: false });

    // Should not throw an error
    expect(() => cg.applyFilter()).not.toThrow();
  });
});

describe('Access filter image data', () => {
  let cg: CCgram | null = null;

  beforeEach(() => {
    // Mock canvas context for jsdom. This is a minimal subset of
    // CanvasRenderingContext2D needed for the tests.
    const mockContext = {
      filter: '',
      drawImage: vi.fn(),
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      // Create a mock blob
      const blob = new Blob(['mock image data'], { type: 'image/png' });
      callback(blob);
    });

    document.body.innerHTML = `
        <img
          src="${IMAGE_SRC}"
          data-filter="${FILTER_NAME}">
      `;

    cg = new CCgram();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return dataURL when call getDataURL method', async (): Promise<void> => {
    const target = getTargetImage()!;
    const dataURL = await cg!.getDataURL(target, { quality: 0.8 });

    expect(DATA_URL_REGEX.test(dataURL!)).toBe(true);
  });

  it('should return blob when call getBlob method', async (): Promise<void> => {
    const target = getTargetImage()!;
    const blob = await cg!.getBlob(target, { quality: 0.8 });

    expect(blob instanceof Blob).toBe(true);
  });

  it('should overwrite filter when call getDataURL method with filter option', async (): Promise<void> => {
    const target = getTargetImage()!;
    const overwriteFilterName = 'aden';
    // Mock getFilterStyle to check if the correct filter is applied
    const getFilterStyleSpy = vi.spyOn(cg!, 'getFilterStyle');
    await cg!.getDataURL(target, { filter: overwriteFilterName });

    expect(getFilterStyleSpy).toHaveBeenCalledWith(overwriteFilterName);
  });

  it('should overwrite filter when call getBlob method with filter option', async (): Promise<void> => {
    const target = getTargetImage()!;
    const overwriteFilterName = 'gingham';
    // Mock getFilterStyle to check if the correct filter is applied
    const getFilterStyleSpy = vi.spyOn(cg!, 'getFilterStyle');
    await cg!.getBlob(target, { filter: overwriteFilterName });

    expect(getFilterStyleSpy).toHaveBeenCalledWith(overwriteFilterName);
  });

  it('should return blob when calling getBlob with JPEG type and quality options', async (): Promise<void> => {
    const target = getTargetImage()!;
    const blob = await cg!.getBlob(target, { type: 'image/jpeg', quality: 0.5 });

    expect(blob instanceof Blob).toBe(true);
  });

  it('should return data URL when calling getDataURL with maximum quality', async (): Promise<void> => {
    const target = getTargetImage()!;
    const dataURL = await cg!.getDataURL(target, { quality: 1.0 });

    expect(DATA_URL_REGEX.test(dataURL!)).toBe(true);
  });

  it('should return null when getBlob returns null', async (): Promise<void> => {
    const target = getTargetImage()!;
    
    // Mock toBlob to return null
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(null);
    });

    const dataURL = await cg!.getDataURL(target, { quality: 0.8 });

    expect(dataURL).toBe(null);
  });

  it('should use filter from dataset when no filter option is provided', async (): Promise<void> => {
    const target = getTargetImage()!;
    const getFilterStyleSpy = vi.spyOn(cg!, 'getFilterStyle');
    
    await cg!.getBlob(target);

    expect(getFilterStyleSpy).toHaveBeenCalledWith(FILTER_NAME);
  });

  it('should throw error for invalid image element in getDataURL', async (): Promise<void> => {
    const invalidElement = createInvalidImageElement();

    await expect(cg!.getDataURL(invalidElement)).rejects.toThrow('[CCgram]');
  });

  it('should throw error for invalid image element in getBlob', async (): Promise<void> => {
    const invalidElement = createInvalidImageElement();

    await expect(cg!.getBlob(invalidElement)).rejects.toThrow('[CCgram]');
  });

  it('should throw error for image element without src in getDataURL', async (): Promise<void> => {
    const imgWithoutSrc = document.createElement('img');
    document.body.appendChild(imgWithoutSrc);

    await expect(cg!.getDataURL(imgWithoutSrc)).rejects.toThrow('src attribute is empty');
  });

  it('should throw error for image element without src in getBlob', async (): Promise<void> => {
    const imgWithoutSrc = document.createElement('img');
    document.body.appendChild(imgWithoutSrc);

    await expect(cg!.getBlob(imgWithoutSrc)).rejects.toThrow('src attribute is empty');
  });
});
