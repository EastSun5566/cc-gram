/**
 * @package cc-gram <https://github.com/EastSun5566/cc-gram>
 *
 * @license MIT
 * @copyright (c) 2019 - present
 * @author 汪東陽 EastSun5566 <https://github.com/EastSun5566>
 */

import { CCgram as _CCgram } from './core';

export * from './filters';
export * from './core';
/** old Name, alias for `CCgram` */
export const CCGram = _CCgram;

export default _CCgram;
