import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
// import { terser } from 'rollup-plugin-terser';

import { main, module } from './package.json';

const plugins = [
  nodeResolve({ extensions: [...DEFAULTS.extensions, '.ts'] }),
  typescript({ tsconfig: 'tsconfig.build.json' }),
  // terser(),
];

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
      sourcemap: true,
      exports: 'named',
    },
    {
      file: module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins,
};

/**
 * @type {import('rollup').RollupOptions}
 */
const workerConfig = {
  input: 'src/drawWorker.ts',
  output: [
    {
      file: 'dist/drawWorker.js',
      format: 'es',
    },
  ],
  plugins,
};

export default [config, workerConfig];
