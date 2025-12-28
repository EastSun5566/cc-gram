/* eslint-disable import/no-extraneous-dependencies */
import { createRequire } from 'node:module';
import { defineConfig } from 'rollup';
import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      name: 'CCGram',
      file: pkg.main,
      format: 'umd',
      // sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      // sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ extensions: [...DEFAULTS.extensions, '.ts'] }),
    typescript(),
    terser(),
    filesize(),
  ],
});
