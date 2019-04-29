/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import filters from './utils/filters';

export default class {
  private _filters = filters;

  private _target: HTMLImageElement | null = null;

  public constructor() {
    if (document.readyState === 'complete') {
      this.applyFilter();
      return;
    }

    document.addEventListener('DOMContentLoaded', this.applyFilter);
  }

  public get filterNameList(): string[] {
    return Array.from(this._filters.keys());
  }

  public getFilterStyle(filterName: string = ''): string {
    const filterSetting = this._filters.get(filterName);

    if (!filterSetting) return 'none';

    return Object
      .keys(filterSetting)
      .map((key): string => `${key}(${filterSetting[key]}${
        key === 'hue-rotate'
          ? 'deg'
          : key === 'blur'
            ? 'px'
            : ''
      })`)
      .join(' ');
  }

  public applyFilter(): void {
    const targets: NodeListOf<HTMLImageElement> = document.querySelectorAll('img[data-filter]');

    targets.forEach((target): void => {
      const { dataset: { filter } } = target;
      target.style.filter = this.getFilterStyle(filter);
    });
  }

  private getCanvasOfImage(): Promise<HTMLCanvasElement> {
    const { _target } = this;
    if (!_target || _target.tagName !== 'IMG') throw new Error('The first argument is required and must be an <img> element.');

    const {
      src,
      dataset: { filter },
    } = _target;

    if (!src) throw new Error('The <img> element src attribute is empty.');

    return new Promise((resolve, reject): void => {
      const image = new Image();

      image.onload = (): void => {
        const { width, height } = image;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('The 2d context canvas is not supported.'));
          return;
        }

        ctx.filter = this.getFilterStyle(filter);
        ctx.drawImage(image, 0, 0);

        resolve(canvas);
      };

      image.onerror = (error): void => reject(error);

      image.crossOrigin = 'anonymous';
      image.src = src;
    });
  }

  public async getDataUrl(elment: HTMLImageElement): Promise<string> {
    this._target = elment;
    const canvas = await this.getCanvasOfImage();

    return canvas.toDataURL();
  }

  public async getBlob(elment: HTMLImageElement): Promise<Blob | null> {
    this._target = elment;
    const canvas = await this.getCanvasOfImage();

    return new Promise((resolve): void => {
      canvas.toBlob((blob): void => resolve(blob));
    });
  }
}
