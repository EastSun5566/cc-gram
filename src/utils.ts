import { FilterSetting } from './filters';
import { MessageData } from './drawWorker';

export const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';
// export const hasWorker = !!Worker;

export const assert = <C = unknown>(condition: C, message: string): void => {
  if (!condition) throw new Error(`[CCgram] ${message}`);
};

/**
 * Parse setting to style string
 * @param {FilterSetting} setting - The filter setting
 */
export const parseSettingToStyle = (setting?: FilterSetting): string => {
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
};

/**
 * Create filter image canvas
 * @param {HTMLImageElement} image - The image
 * @param {string} filterStyle - The filter style
 */
export const createFilterImageCanvas = (
  image: HTMLImageElement,
  filterStyle: string,
): Promise<HTMLCanvasElement | OffscreenCanvas> => new Promise((resolve, reject): void => {
  const { naturalWidth, naturalHeight } = image;

  const canvas = document.createElement('canvas');
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  // fallback regular canvas if don't support OffscreenCanvas
  if (hasOffscreenCanvas) {
    const drawWorker = new Worker('./drawWorker.js');
    const OffscreenCanvas = canvas.transferControlToOffscreen();

    drawWorker.addEventListener('message', ({ data }: MessageEvent<string>) => {
      console.log(`${data} in main thread`);

      resolve(canvas);
    });

    drawWorker.postMessage({ canvas: OffscreenCanvas } as MessageData, [OffscreenCanvas]);
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    reject(new Error('The 2d context canvas is not supported.'));
    return;
  }

  ctx.filter = filterStyle;
  ctx.drawImage(image, 0, 0);

  resolve(canvas);
});
