/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import filters from './utils/filters';

export default class {
  private _filters = filters;

  public constructor() {
    this.applyFilter();
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
    const targets: NodeListOf<HTMLElement> = document.querySelectorAll('img[data-filter]');

    targets.forEach((target): void => {
      const filterName = target.dataset.filter;
      target.style.filter = this.getFilterStyle(filterName);
    });
  }
}
