import { createRequire } from 'node:module';
import {
  writeFileSync, readFileSync, existsSync, readdirSync,
} from 'node:fs';
import { defineConfig } from 'rollup';
import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const INDEX_DTS = 'dist/index.d.ts';
const INDEX_DCTS = 'dist/index.d.cts';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      name: 'CCGram',
      file: 'dist/index.umd.js',
      format: 'umd',
      // sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      // sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      // sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ extensions: [...DEFAULTS.extensions, '.ts'] }),
    typescript(),
    terser(),
    {
      name: 'generate-cts',
      writeBundle() {
        // Copy .d.ts to .d.cts for CommonJS types
        if (existsSync(INDEX_DTS)) {
          try {
            const declarationFiles = readdirSync('dist').filter((file) => file.endsWith('.d.ts'));
            declarationFiles.forEach((file) => {
              const path = `dist/${file}`;
              const content = readFileSync(path, 'utf-8').replace(
                /(from\s+['"]\.\/[^'"]+|import\s*\(\s*['"]\.\/[^'"]+)/g,
                (specifier) => (specifier.endsWith('.js') ? specifier : `${specifier}.js`),
              );
              writeFileSync(path, content);
            });
            writeFileSync(INDEX_DCTS, readFileSync(INDEX_DTS, 'utf-8'));
          } catch (error) {
            console.error('Failed to generate CommonJS type declarations:', error);
            throw error;
          }
        } else {
          console.warn(
            `[generate-cts] Expected type declaration file "${INDEX_DTS}" not found. `
              + `Skipping generation of "${INDEX_DCTS}". `
              + 'Ensure TypeScript is configured to emit declaration files for proper CJS type resolution.',
          );
        }
      },
    },
  ],
});
