import { FilterSetting } from './filters';

import { ParseOptions } from './types';

export const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

export function assert<TCond = unknown>(condition: TCond, message = 'internal error.'): asserts condition {
  if (!condition) throw Error(`[CCgram] ${message}`);
}

export function assertIsImage(image: HTMLImageElement): asserts image is HTMLImageElement {
  assert(image && image.tagName === 'IMG', 'The first argument is required and must be an <img> element.');
  assert(image.src, 'The <img> element src attribute is empty.');
}

export function createWorker<
  TData = unknown,
  TMessage = unknown
>(fn: (messageEvent: MessageEvent<TData>) => TMessage): Worker {
  const code = `
    const work = ${fn.toString()};

    addEventListener('message', async (...params) => {
      const res = await work(...params);
      postMessage(res);
    });
  `;

  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  const worker = new Worker(url);

  const { terminate } = worker;
  worker.terminate = (): void => {
    URL.revokeObjectURL(url);
    terminate.call(worker);
  };

  return worker;
}

/**
 * Parse setting to style string
 * @param {FilterSetting} setting - The filter setting
 */
export function parseSettingToStyle(setting?: FilterSetting): string {
  if (!setting) return 'none';

  return Object
    .keys(setting)
    .map((key): string => `${key}(${setting[key]}${
      key === 'hue-rotate'
        ? 'deg'
        : key === 'blur'
          ? 'px'
          : ''
    })`)
    .join(' ');
}

interface CreateBlobOptions<
  TCanvas extends HTMLCanvasElement | OffscreenCanvas = HTMLCanvasElement
> {
  canvas: TCanvas;
  image: CanvasImageSource;
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

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('The 2d context canvas is not supported.');

  ctx.filter = filterStyle;
  ctx.drawImage(image, 0, 0);

  return canvas.convertToBlob(options);
}
