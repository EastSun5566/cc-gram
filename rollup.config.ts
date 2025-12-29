/* eslint-disable import/no-extraneous-dependencies */
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'rollup';
import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const INDEX_DTS = 'dist/index.d.ts';
const INDEX_DCTS = 'dist/index.d.cts';

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
    {
      name: 'generate-cts',
      writeBundle() {
        // Copy .d.ts to .d.cts for CommonJS types
        if (existsSync(INDEX_DTS)) {
          const dtsContent = readFileSync(INDEX_DTS, 'utf-8');
          writeFileSync(INDEX_DCTS, dtsContent);
        }
      },
    },
  ],
});
