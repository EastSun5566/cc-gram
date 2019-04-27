/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import filters from './utils/filters';

export default class {
  private _filters = filters;

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
    const targetImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('img[data-filter]');

    targetImages.forEach((target): void => {
      const { dataset } = target;
      target.style.filter = this.getFilterStyle(dataset.filter);
    });
  }

  public getDataUrl(imageElement: HTMLImageElement): Promise<string> {
    if (!imageElement || imageElement.tagName !== 'IMG') throw new Error();

    const {
      src,
      dataset,
    } = imageElement;

    if (!src) return Promise.resolve('');

    return new Promise((resolve, reject): void => {
      const image = new Image();

      image.onload = ({ target }): void => {
        const { width, height } = target;
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error();

        ctx.filter = this.getFilterStyle(dataset.filter);
        ctx.drawImage(target, 0, 0);

        resolve(canvas.toDataURL());
      };

      image.onerror = (error): void => reject(error);

      image.crossOrigin = 'anonymous';
      image.src = src;
    });
  }
}
