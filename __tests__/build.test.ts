import { expect, it } from 'vitest';
import { rollup } from 'rollup';

import config from '../rollup.config';

it('prepares complete declarations for every output before writing files', async () => {
  const bundle = await rollup(config);

  try {
    const results = await Promise.all(
      [config.output!].flat().map((options) => bundle.generate(options)),
    );

    results.forEach(({ output }) => {
      const declarations = new Map(
        output.filter((file) => file.type === 'asset').map((file) => [file.fileName, file.source]),
      );

      expect(declarations.get('core.d.ts')).toContain('export declare class CCgram');
      expect(declarations.get('core.d.ts')).toContain("from './filters.js'");
      expect(declarations.get('index.d.ts')).toContain("export * from './core.js'");
      expect(declarations.get('index.d.cts')).toBe(declarations.get('index.d.ts'));
    });
  } finally {
    await bundle.close();
  }
}, 10000);
