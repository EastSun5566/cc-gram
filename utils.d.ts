import { FilterSetting } from './filters';
export declare const hasOffscreenCanvas = true;
export declare const assert: <C = unknown>(condition: C, message: string) => void;
/**
 * Parse setting to style string
 * @param {FilterSetting} setting - The filter setting
 */
export declare const parseSettingToStyle: (setting?: FilterSetting | undefined) => string;
/**
 * Create filter image canvas
 * @param {HTMLImageElement} image - The image
 * @param {string} filterStyle - The filter style
 */
export declare const createFilterImageCanvas: (image: HTMLImageElement, filterStyle: string) => Promise<HTMLCanvasElement | OffscreenCanvas>;
