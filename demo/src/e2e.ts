import fixtureUrl from '../../e2e/fixtures/render-2x2.png?url';
import { CCgram } from '../../src/index.ts';
import { createWorker, hasOffscreenCanvas } from '../../src/utils.ts';

export interface RenderResult {
  mode: 'worker' | 'fallback';
  type: string;
  width: number;
  height: number;
  pixels: number[];
}

export interface E2EApi {
  ready: true;
  render(filterName?: string): Promise<RenderResult>;
  renderFromAttribute(
    dataAttribute: string,
    method: 'getBlob' | 'getDataURL',
  ): Promise<RenderResult & { preview: string }>;
  rejectInWorker(): Promise<never>;
}

declare global {
  interface Window {
    ccgramE2E: E2EApi;
  }
}

const filter = new CCgram({ init: false });
filter.setFilter('invert', { invert: 1 });
filter.setFilter('partial-invert', { blur: undefined, invert: 1, sepia: undefined });
filter.setFilter('undefined-only', { blur: undefined, invert: undefined });

async function loadFixture(): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = fixtureUrl;
  await image.decode();
  return image;
}

async function readPixels(blob: Blob): Promise<Pick<RenderResult, 'width' | 'height' | 'pixels'>> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('The browser test requires a 2D canvas context.');

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  return {
    width: canvas.width,
    height: canvas.height,
    pixels: Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data),
  };
}

async function render(filterName = ''): Promise<RenderResult> {
  const image = await loadFixture();
  const blob = await filter.getBlob(image, { type: 'image/png', filter: filterName });
  if (!blob) throw new Error('The browser encoder returned a null Blob.');

  return {
    mode: hasOffscreenCanvas ? 'worker' : 'fallback',
    type: blob.type,
    ...await readPixels(blob),
  };
}

function rejectInWorker(): Promise<never> {
  const worker = createWorker(async () => {
    const error = new Error('[CCgram] Deliberate async Worker rejection.');
    error.name = 'DeliberateWorkerError';
    throw error;
  });

  return new Promise((_resolve, reject) => {
    worker.addEventListener('message', ({ data }: MessageEvent<unknown>) => {
      worker.terminate();

      if (
        typeof data === 'object'
        && data !== null
        && 'ok' in data
        && data.ok === false
        && 'error' in data
        && typeof data.error === 'object'
        && data.error !== null
        && 'name' in data.error
        && typeof data.error.name === 'string'
        && 'message' in data.error
        && typeof data.error.message === 'string'
      ) {
        const error = new Error(data.error.message);
        error.name = data.error.name;
        reject(error);
        return;
      }

      reject(new Error('[CCgram] The image Worker returned an invalid response.'));
    }, { once: true });

    worker.addEventListener('error', (event) => {
      worker.terminate();
      reject(event.error ?? new Error(event.message));
    }, { once: true });

    worker.postMessage(undefined);
  });
}

async function renderFromAttribute(
  dataAttribute: string,
  method: 'getBlob' | 'getDataURL',
): Promise<RenderResult & { preview: string }> {
  const customFilter = new CCgram({ init: false, dataAttribute });
  customFilter.setFilter('invert', { invert: 1 });
  const image = await loadFixture();
  image.setAttribute(`data-${dataAttribute}`, 'invert');
  document.body.append(image);

  try {
    customFilter.applyFilter();
    // Do not supply options.filter: the export must select from the dataset.
    const result = await customFilter[method](image, { type: 'image/png' });
    if (!result) throw new Error('The browser encoder returned no image.');
    const blob = typeof result === 'string' ? await (await fetch(result)).blob() : result;

    return {
      mode: hasOffscreenCanvas ? 'worker' : 'fallback',
      type: blob.type,
      preview: image.style.filter,
      ...await readPixels(blob),
    };
  } finally {
    image.remove();
  }
}

window.ccgramE2E = {
  ready: true,
  render,
  renderFromAttribute,
  rejectInWorker,
};

document.documentElement.dataset.ready = 'true';
