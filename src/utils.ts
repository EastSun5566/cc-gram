import type { FilterSetting } from './filters';
import type { ParseOptions } from './types';

export const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

export function camelize(string: string): string {
  return string
    .replace(/[A-Z]/g, (c) => c.toLowerCase())
    .replace(/-[a-z]/g, (c) => c.slice(1).toUpperCase());
}

export function assert<TCond = unknown>(condition: TCond, message = 'internal error.'): asserts condition {
  if (!condition) throw Error(`[CCgram] ${message}`);
}

export function assertIsImage(image: HTMLImageElement): asserts image is HTMLImageElement {
  assert(image && image.tagName === 'IMG', 'The first argument is required and must be an <img> element.');
  assert(image.src, 'The <img> element src attribute is empty.');
}

export function createWorker<
  TData = unknown,
  TMessage = unknown,
>(fn: (messageEvent: MessageEvent<TData>) => TMessage | Promise<TMessage>): Worker {
  const code = `
    const work = ${fn.toString()};

    addEventListener('message', async (...params) => {
      try {
        const value = await work(...params);
        postMessage({ ok: true, value });
      } catch (error) {
        postMessage({
          ok: false,
          error: {
            name: error && typeof error.name === 'string' ? error.name : 'Error',
            message: error && typeof error.message === 'string' ? error.message : String(error),
          },
        });
      }
    });
  `;

  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  let worker: Worker;
  try {
    worker = new Worker(url);
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }

  const { terminate } = worker;
  worker.terminate = (): void => {
    URL.revokeObjectURL(url);
    terminate.call(worker);
  };

  return worker;
}

/**
 * Parse setting to style string
 * @param setting - The filter setting
 */
export function parseSettingToStyle(setting?: FilterSetting): string {
  if (!setting) return 'none';

  return Object
    .keys(setting)
    .filter((key) => setting[key] !== undefined)
    .map((key): string => `${key}(${setting[key]}${
      key === 'hue-rotate'
        ? 'deg'
        : key === 'blur'
          ? 'px'
          : ''
    })`)
    .join(' ') || 'none';
}

interface CreateBlobOptions<
  TCanvas extends HTMLCanvasElement | OffscreenCanvas = HTMLCanvasElement,
> {
  canvas: TCanvas;
  image: ImageBitmap;
  filterStyle: string;
  options: ParseOptions;
}

export function createBlobWorker({
  data,
}: MessageEvent<CreateBlobOptions<OffscreenCanvas>>): Promise<Blob | null> {
  const {
    canvas,
    image,
    filterStyle,
    options,
  } = data;

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('The 2d context canvas is not supported.');

    // Keep this check self-contained because the Worker serializes this function.
    if (typeof ctx.filter === 'string') {
      ctx.filter = filterStyle;
    } else if (filterStyle && filterStyle !== 'none') {
      throw new Error('[CCgram] Canvas filters are not supported.');
    }
    ctx.drawImage(image, 0, 0);

    return canvas.convertToBlob(options);
  } finally {
    image.close();
  }
}
