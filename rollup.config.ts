import { createRequire } from 'node:module';
import { defineConfig } from 'rollup';
import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const INDEX_DTS = 'index.d.ts';
const INDEX_DCTS = 'index.d.cts';

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
      generateBundle(_options, bundle) {
        // Prepare assets before parallel outputs write the same declaration files.
        Object.values(bundle).forEach((file) => {
          if (file.type !== 'asset' || !file.fileName.endsWith('.d.ts')) return;

          const content = typeof file.source === 'string'
            ? file.source
            : Buffer.from(file.source).toString('utf-8');
          file.source = content.replace(
            /(from\s+['"]\.\/[^'"]+|import\s*\(\s*['"]\.\/[^'"]+)/g,
            (specifier) => (specifier.endsWith('.js') ? specifier : `${specifier}.js`),
          );
        });

        const declaration = bundle[INDEX_DTS];
        if (declaration?.type === 'asset') {
          this.emitFile({ type: 'asset', fileName: INDEX_DCTS, source: declaration.source });
        } else {
          this.warn(
            `[generate-cts] Expected type declaration asset "${INDEX_DTS}" not found. `
              + `Skipping generation of "${INDEX_DCTS}". `
              + 'Ensure TypeScript is configured to emit declaration files for proper CJS type resolution.',
          );
        }
      },
    },
  ],
});
