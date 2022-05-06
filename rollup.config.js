import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

import { main, module } from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      name: 'CCGram',
      file: main,
      format: 'umd',
      // sourcemap: true,
      exports: 'named',
    },
    {
      file: module,
      format: 'es',
      // sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ extensions: [...DEFAULTS.extensions, '.ts'] }),
    typescript({ tsconfig: 'tsconfig.build.json' }),
    terser(),
    filesize(),
  ],
};

export default config;
