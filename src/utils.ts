import { FilterSetting } from './types';

/**
 * parseSettingToStyle
 *
 * @param {FilterSetting} setting
 */
export const parseSettingToStyle = (setting: FilterSetting | undefined): string => {
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
 * createFilterImageCanvas
 *
 * @param {HTMLImageElement['src']} src
 * @param {string} filterStyle
 */
export const createFilterImageCanvas = (
  src: HTMLImageElement['src'],
  filterStyle: string,
): Promise<HTMLCanvasElement> => new Promise((resolve, reject): void => {
  const image = new Image();

  image.onload = (): void => {
    const { width, height } = image;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      reject(new Error('The 2d context canvas is not supported.'));
      return;
    }

    ctx.filter = filterStyle;
    ctx.drawImage(image, 0, 0);

    resolve(canvas);
  };

  image.onerror = (error): void => reject(error);

  image.crossOrigin = 'anonymous';
  image.src = src;
});
