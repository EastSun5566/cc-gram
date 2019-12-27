import { FilterSetting } from './filters';

/**
 * Parse setting to style
 *
 * @param {FilterSetting} setting - The filter setting
 * @returns {string} The filter style
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
 * Create filter image canvas
 *
 * @param {HTMLImageElement['src']} src - The src of image
 * @param {string} filterStyle - The filter style
 * @returns {Promise<HTMLCanvasElement>}
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
