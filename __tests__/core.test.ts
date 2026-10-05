import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  vi,
} from 'vitest';

import { CCgram } from '../src';
import { DEFAULT_FILTERS } from '../src/filters';
import { createBlobWorker } from '../src/utils';

describe('Read/Write filter list', (): void => {
  let cg: CCgram | null = null;

  beforeEach(() => {
    cg = new CCgram({ init: false });
  });

  it('should get all filter name', (): void => {
    expect(cg!.filterNames).toEqual([...DEFAULT_FILTERS.keys()]);
  });

  it('should add filter', (): void => {
    cg!.setFilter('my-filter', { saturate: 0.8 });

    expect(cg!.filterNames).toContain('my-filter');
  });

  it('should remove filter', (): void => {
    const { filterNames } = cg!;
    const targetFilterName = filterNames[0]!;

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

  it('should isolate instances and default settings', (): void => {
    const a = new CCgram({ init: false });
    const b = new CCgram({ init: false });
    const original = { ...DEFAULT_FILTERS.get('aden')! };

    a.setFilter('custom', { blur: 2 });
    a.removeFilter('inkwell');
    a.getFilterSetting('aden')!.brightness = 9;

    expect(b.filterNames).toContain('inkwell');
    expect(b.filterNames).not.toContain('custom');
    expect(b.getFilterSetting('aden')).toEqual(original);
    expect(DEFAULT_FILTERS.get('aden')).toEqual(original);
  });

  it('does not share setting objects with defaults or new instances', (): void => {
    const first = new CCgram({ init: false });
    first.getFilterSetting('1977')!.contrast = 99;

    expect(new CCgram({ init: false }).getFilterSetting('1977')!.contrast)
      .not.toBe(99);
    expect(DEFAULT_FILTERS.get('1977')!.contrast).not.toBe(99);
  });
});

describe('Document ready state initialization', () => {
  const readyStateDescriptor = Object.getOwnPropertyDescriptor(document, 'readyState');

  afterEach(() => {
    if (readyStateDescriptor) {
      Object.defineProperty(document, 'readyState', readyStateDescriptor);
    } else {
      delete (document as Partial<Document> & { readyState?: DocumentReadyState }).readyState;
    }
    vi.restoreAllMocks();
  });

  it.each(['interactive', 'complete'] as const)('applies synchronously in %s state', (state) => {
    Object.defineProperty(document, 'readyState', { configurable: true, value: state });
    const apply = vi.spyOn(CCgram.prototype, 'applyFilter');
    const addEventListener = vi.spyOn(document, 'addEventListener');
    new CCgram();
    expect(apply).toHaveBeenCalledOnce();
    expect(addEventListener.mock.calls.some(([type]) => type === 'DOMContentLoaded')).toBe(false);
  });

  it('waits for DOMContentLoaded once in loading state', () => {
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'loading' });
    const apply = vi.spyOn(CCgram.prototype, 'applyFilter');
    const addEventListener = vi.spyOn(document, 'addEventListener');
    new CCgram();
    expect(apply).not.toHaveBeenCalled();
    document.dispatchEvent(new Event('DOMContentLoaded'));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(apply).toHaveBeenCalledOnce();
    expect(addEventListener).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function),
      { once: true },
    );
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

const makeImageReady = (image: HTMLImageElement): void => {
  Object.defineProperties(image, {
    complete: { configurable: true, value: true },
    naturalWidth: { configurable: true, value: 100 },
    naturalHeight: { configurable: true, value: 80 },
  });
};

describe('Apply filter to target Image', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' });
    document.body.innerHTML = '';
  });

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
    Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' });
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
    makeImageReady(getTargetImage()!);
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
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it.each(['getBlob', 'getDataURL'] as const)('rejects %s before drawing when canvas filters are unsupported', async (method) => {
    const context = { drawImage: vi.fn() };
    vi.mocked(HTMLCanvasElement.prototype.getContext)
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);

    await expect(cg![method](getTargetImage()!)).rejects.toThrow('[CCgram] Canvas filters are not supported.');
    expect(context.drawImage).not.toHaveBeenCalled();
    expect(HTMLCanvasElement.prototype.toBlob).not.toHaveBeenCalled();
    expect(context).not.toHaveProperty('filter');
  });

  it('exports without filters when the canvas filter capability is absent', async () => {
    const context = { drawImage: vi.fn() };
    vi.mocked(HTMLCanvasElement.prototype.getContext)
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);

    await expect(cg!.getBlob(getTargetImage()!, { filter: '' })).resolves.toBeInstanceOf(Blob);
    expect(context.drawImage).toHaveBeenCalledOnce();
    expect(context).not.toHaveProperty('filter');
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

  it('waits for an incomplete image to decode before allocating a canvas', async () => {
    const image = getTargetImage()!;
    let finishDecode!: () => void;
    const decode = vi.fn(() => new Promise<void>((resolve) => {
      finishDecode = resolve;
    }));
    Object.defineProperties(image, {
      complete: { configurable: true, value: false },
      naturalWidth: { configurable: true, value: 100 },
      naturalHeight: { configurable: true, value: 80 },
      decode: { configurable: true, value: decode },
    });
    const createElement = vi.spyOn(document, 'createElement');

    const result = cg!.getBlob(image);
    expect(decode).toHaveBeenCalledOnce();
    expect(createElement.mock.calls.some(([tag]) => tag === 'canvas')).toBe(false);

    finishDecode();
    await expect(result).resolves.toBeInstanceOf(Blob);
    expect(createElement.mock.calls.some(([tag]) => tag === 'canvas')).toBe(true);
  });

  it('does not decode an already-loaded image', async () => {
    const image = getTargetImage()!;
    const decode = vi.fn();
    Object.defineProperty(image, 'decode', { configurable: true, value: decode });

    await expect(cg!.getBlob(image)).resolves.toBeInstanceOf(Blob);
    expect(decode).not.toHaveBeenCalled();
  });

  it('rejects decode failures with the stable library error before canvas allocation', async () => {
    const image = getTargetImage()!;
    Object.defineProperties(image, {
      complete: { configurable: true, value: false },
      decode: { configurable: true, value: vi.fn().mockRejectedValue(new Error('browser detail')) },
    });
    const createElement = vi.spyOn(document, 'createElement');

    await expect(cg!.getBlob(image)).rejects.toThrow('[CCgram] The image could not be decoded.');
    expect(createElement.mock.calls.some(([tag]) => tag === 'canvas')).toBe(false);
  });

  it('rejects a complete image with zero dimensions before canvas allocation', async () => {
    const image = getTargetImage()!;
    Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 0 });
    const createElement = vi.spyOn(document, 'createElement');

    await expect(cg!.getBlob(image)).rejects.toThrow('[CCgram] The image could not be decoded.');
    expect(createElement.mock.calls.some(([tag]) => tag === 'canvas')).toBe(false);
  });
});

describe('FileReader terminal events', () => {
  class MockFileReader extends EventTarget {
    static instance: MockFileReader | undefined;

    static readError: Error | undefined;

    result: string | ArrayBuffer | null = null;

    error: DOMException | null = null;

    readAsDataURL = vi.fn(() => {
      if (MockFileReader.readError) throw MockFileReader.readError;
    });

    removeEventListener = vi.fn(super.removeEventListener.bind(this));

    constructor() {
      super();
      MockFileReader.instance = this;
    }
  }

  beforeEach(() => {
    MockFileReader.instance = undefined;
    MockFileReader.readError = undefined;
    vi.stubGlobal('FileReader', MockFileReader);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const startRead = (): Promise<string | null> => {
    const cg = new CCgram({ init: false });
    vi.spyOn(cg, 'getBlob').mockResolvedValue(new Blob(['data']));
    const image = document.createElement('img');
    image.src = IMAGE_SRC;
    return cg.getDataURL(image);
  };

  it('resolves on load and removes every listener', async () => {
    const promise = startRead();
    await vi.waitFor(() => expect(MockFileReader.instance).toBeDefined());
    MockFileReader.instance!.result = 'data:image/png;base64,ZGF0YQ==';
    MockFileReader.instance!.dispatchEvent(new Event('load'));

    await expect(promise).resolves.toBe('data:image/png;base64,ZGF0YQ==');
    expect(MockFileReader.instance!.removeEventListener).toHaveBeenCalledTimes(3);
  });

  it('rejects on error and removes every listener', async () => {
    const promise = startRead();
    const assertion = expect(promise).rejects.toThrow('read failed');
    await vi.waitFor(() => expect(MockFileReader.instance).toBeDefined());
    MockFileReader.instance!.error = new DOMException('read failed');
    MockFileReader.instance!.dispatchEvent(new Event('error'));

    await assertion;
    expect(MockFileReader.instance!.removeEventListener).toHaveBeenCalledTimes(3);
  });

  it('rejects on abort and removes every listener', async () => {
    const promise = startRead();
    const assertion = expect(promise).rejects.toThrow('[CCgram] Reading the image data was aborted.');
    await vi.waitFor(() => expect(MockFileReader.instance).toBeDefined());
    MockFileReader.instance!.dispatchEvent(new Event('abort'));

    await assertion;
    expect(MockFileReader.instance!.removeEventListener).toHaveBeenCalledTimes(3);
  });

  it('rejects a synchronous read failure and removes every listener', async () => {
    const readError = new Error('read threw');
    MockFileReader.readError = readError;

    await expect(startRead()).rejects.toBe(readError);
    expect(MockFileReader.instance!.removeEventListener).toHaveBeenCalledTimes(3);
  });
});

describe('Worker image export lifecycle', () => {
  type Listener = (event: Event) => void;

  class MockWorker {
    static instance: MockWorker | undefined;

    static constructorError: Error | undefined;

    static postMessageError: Error | undefined;

    listeners = new Map<string, Set<Listener>>();

    terminateCount = 0;

    postMessage = vi.fn(() => {
      if (MockWorker.postMessageError) throw MockWorker.postMessageError;
    });

    constructor() {
      if (MockWorker.constructorError) throw MockWorker.constructorError;
      MockWorker.instance = this;
    }

    addEventListener(type: string, listener: Listener): void {
      const listeners = this.listeners.get(type) ?? new Set();
      listeners.add(listener);
      this.listeners.set(type, listeners);
    }

    removeEventListener(type: string, listener: Listener): void {
      this.listeners.get(type)?.delete(listener);
    }

    terminate(): void {
      this.terminateCount += 1;
    }

    emit(type: string, event: Event): void {
      [...(this.listeners.get(type) ?? [])].forEach((listener) => listener(event));
    }
  }

  class MockOffscreenCanvas {
    constructor(public width: number, public height: number) {}
  }

  class MockURL extends URL {
    static createObjectURL = vi.fn(() => 'blob:worker');

    static revokeObjectURL = vi.fn();
  }

  const bitmap = { close: vi.fn() };

  beforeEach(() => {
    vi.resetModules();
    bitmap.close.mockReset();
    MockWorker.instance = undefined;
    MockWorker.constructorError = undefined;
    MockWorker.postMessageError = undefined;
    MockURL.createObjectURL.mockReset().mockReturnValue('blob:worker');
    MockURL.revokeObjectURL.mockReset();
    vi.stubGlobal('OffscreenCanvas', MockOffscreenCanvas);
    vi.stubGlobal('Worker', MockWorker);
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
    vi.stubGlobal('URL', MockURL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const startWorkerExport = async () => {
    const { CCgram: WorkerCCgram } = await import('../src/core');
    const image = document.createElement('img');
    image.src = IMAGE_SRC;
    makeImageReady(image);
    const promise = new WorkerCCgram({ init: false }).getBlob(image);
    promise.catch(() => {});
    await vi.waitFor(() => expect(MockWorker.instance).toBeDefined());
    return { promise, worker: MockWorker.instance! };
  };

  it.each([
    ['blob', new Blob(['result'])],
    ['null', null],
  ])('settles a %s success and terminates exactly once', async (_label, value) => {
    const { promise, worker } = await startWorkerExport();
    worker.emit('message', new MessageEvent('message', { data: { ok: true, value } }));
    worker.emit('error', new ErrorEvent('error', { message: 'late error' }));

    await expect(promise).resolves.toBe(value);
    expect(worker.terminateCount).toBe(1);
    expect(bitmap.close).not.toHaveBeenCalled();
  });

  it('reconstructs a structured Worker failure and terminates exactly once', async () => {
    const { promise, worker } = await startWorkerExport();
    worker.emit('message', new MessageEvent('message', {
      data: { ok: false, error: { name: 'EncodingError', message: 'encode failed' } },
    }));

    await expect(promise).rejects.toMatchObject({ name: 'EncodingError', message: 'encode failed' });
    expect(worker.terminateCount).toBe(1);
  });

  it('copies Worker ErrorEvent details into a library-owned Error', async () => {
    const { promise, worker } = await startWorkerExport();
    const browserError = new DOMException('worker failed', 'NetworkError');
    const rejection = promise.catch((error: unknown) => error);
    worker.emit('error', new ErrorEvent('error', {
      error: browserError,
      message: 'event fallback',
    }));

    const error = await rejection;
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBe(browserError);
    expect(error).toMatchObject({ name: 'NetworkError', message: 'worker failed' });
    expect(worker.terminateCount).toBe(1);
  });

  it('rejects on Worker messageerror and terminates exactly once', async () => {
    const { promise, worker } = await startWorkerExport();
    worker.emit('messageerror', new MessageEvent('messageerror'));

    await expect(promise).rejects.toThrow('[CCgram] The image Worker response could not be decoded.');
    expect(worker.terminateCount).toBe(1);
  });

  it.each([
    null,
    {},
    { ok: true },
    { ok: true, value: {} },
    { ok: false, error: null },
    { ok: false, error: { name: 'EncodingError' } },
  ])('rejects malformed Worker message %# and terminates exactly once', async (data) => {
    const { promise, worker } = await startWorkerExport();
    worker.emit('message', new MessageEvent('message', { data }));

    await expect(promise).rejects.toThrow('[CCgram] The image Worker returned an invalid response.');
    expect(worker.terminateCount).toBe(1);
  });

  it('closes the bitmap, rejects, and terminates once when transfer throws', async () => {
    const transferError = new Error('transfer failed');
    MockWorker.postMessageError = transferError;
    const { promise, worker } = await startWorkerExport();

    await expect(promise).rejects.toBe(transferError);
    expect(worker.terminateCount).toBe(1);
    expect(bitmap.close).toHaveBeenCalledOnce();
  });

  it('closes the bitmap and falls back when Worker creation throws', async () => {
    const createError = new Error('worker creation failed');
    MockWorker.constructorError = createError;
    const result = new Blob(['fallback']);
    const context = { filter: '', drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(result);
    });
    const { CCgram: WorkerCCgram } = await import('../src/core');
    const image = document.createElement('img');
    image.src = IMAGE_SRC;
    makeImageReady(image);

    await expect(new WorkerCCgram({ init: false }).getBlob(image)).resolves.toBe(result);
    expect(bitmap.close).toHaveBeenCalledOnce();
    expect(MockWorker.instance).toBeUndefined();
    expect(MockURL.revokeObjectURL).toHaveBeenCalledOnce();
    expect(MockURL.revokeObjectURL).toHaveBeenCalledWith('blob:worker');
    expect(context.drawImage).toHaveBeenCalledWith(image, 0, 0);
  });

  it('closes transferred bitmap in the Worker and requests an alpha-capable context', async () => {
    const close = vi.fn();
    const context = { filter: '', drawImage: vi.fn() };
    const canvas = {
      getContext: vi.fn(() => context),
      convertToBlob: vi.fn().mockResolvedValue(new Blob(['result'])),
    };

    await expect(createBlobWorker({
      data: {
        canvas,
        image: { close } as unknown as ImageBitmap,
        filterStyle: 'none',
        options: { type: 'image/png' },
      },
    } as MessageEvent)).resolves.toBeInstanceOf(Blob);
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
    expect(close).toHaveBeenCalledOnce();
  });

  it.each(['none', '', 'invert(1)'])('handles unsupported Worker canvas filters for %j and closes the bitmap', async (filterStyle) => {
    const close = vi.fn();
    const context = { drawImage: vi.fn() };
    const canvas = {
      getContext: vi.fn(() => context),
      convertToBlob: vi.fn().mockResolvedValue(new Blob(['result'])),
    };
    const render = (): Promise<Blob | null> => createBlobWorker({
      data: {
        canvas,
        image: { close } as unknown as ImageBitmap,
        filterStyle,
        options: { type: 'image/png' },
      },
    } as MessageEvent);

    if (filterStyle === 'invert(1)') {
      expect(render).toThrow('[CCgram] Canvas filters are not supported.');
      expect(context.drawImage).not.toHaveBeenCalled();
      expect(canvas.convertToBlob).not.toHaveBeenCalled();
    } else {
      await expect(render()).resolves.toBeInstanceOf(Blob);
      expect(context.drawImage).toHaveBeenCalledOnce();
    }
    expect(context).not.toHaveProperty('filter');
    expect(close).toHaveBeenCalledOnce();
  });
});
