import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = mkdtempSync(join(tmpdir(), 'cc-gram-package-'));

class CommandError extends Error {
  constructor(command, exitCode) {
    super(`Command failed with exit code ${exitCode}: ${command}`);
    this.exitCode = exitCode;
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new CommandError([command, ...args].join(' '), result.status ?? 1);
  }
}

function runPnpm(args, cwd) {
  const pnpmCli = process.env.npm_execpath;
  if (pnpmCli) {
    run(process.execPath, [pnpmCli, ...args], cwd);
    return;
  }

  run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, cwd);
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function createConsumer(name, packageType) {
  const consumerDir = join(tempDir, name);
  mkdirSync(consumerDir);
  writeJson(join(consumerDir, 'package.json'), {
    name: `cc-gram-${name}-consumer`,
    private: true,
    version: '0.0.0',
    ...(packageType ? { type: packageType } : {}),
  });
  return consumerDir;
}

function installTarball(consumerDir, tarballPath) {
  runPnpm(['add', '--ignore-scripts', '--save-exact', tarballPath], consumerDir);
}

try {
  runPnpm(['pack', '--pack-destination', tempDir], rootDir);

  const tarballs = readdirSync(tempDir).filter((file) => file.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, `Expected one package tarball, found ${tarballs.length}`);
  const tarballPath = join(tempDir, tarballs[0]);

  const esmDir = createConsumer('esm', 'module');
  writeFileSync(join(esmDir, 'index.mjs'), `
import assert from 'node:assert/strict';

const { default: packageDefault, CCgram, createFilter } = await import('cc-gram');

assert.equal(typeof createFilter, 'function');
assert.equal(typeof CCgram, 'function');
assert.equal(typeof packageDefault, 'function');
console.log('ESM: ok');
`.trimStart());
  installTarball(esmDir, tarballPath);
  run(process.execPath, ['index.mjs'], esmDir);

  const cjsDir = createConsumer('cjs');
  writeFileSync(join(cjsDir, 'index.cjs'), `
const assert = require('node:assert/strict');
const packageExports = require('cc-gram');

assert.equal(typeof packageExports.createFilter, 'function');
assert.equal(typeof packageExports.CCgram, 'function');
assert.equal(typeof packageExports.default, 'function');
console.log('CJS: ok');
`.trimStart());
  installTarball(cjsDir, tarballPath);
  run(process.execPath, ['index.cjs'], cjsDir);

  const typesDir = createConsumer('types', 'module');
  writeFileSync(join(typesDir, 'index.ts'), `
import DefaultFilter, { CCgram, createFilter } from 'cc-gram';
import type { FilterInstance } from 'cc-gram';

type RequireExports = typeof import('cc-gram', {
  with: { 'resolution-mode': 'require' },
});
type RequireFilterInstance = import('cc-gram', {
  with: { 'resolution-mode': 'require' },
}).FilterInstance;

const filter: FilterInstance = createFilter({ init: false });
const constructor: typeof CCgram = DefaultFilter;
declare const packageExports: RequireExports;
const requireFilter: RequireFilterInstance = packageExports.createFilter({ init: false });
const requireConstructor: typeof packageExports.CCgram = packageExports.default;
void filter;
void constructor;
void requireFilter;
void requireConstructor;
`.trimStart());
  writeJson(join(typesDir, 'tsconfig.json'), {
    compilerOptions: {
      lib: ['ES2023', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
      strict: true,
      target: 'ES2022',
      types: [],
    },
    include: ['index.ts'],
  });
  installTarball(typesDir, tarballPath);
  run(process.execPath, [resolve(rootDir, 'node_modules/typescript/bin/tsc'), '--project', 'tsconfig.json'], typesDir);
  console.log('types: ok');

  const cjsTypesDir = createConsumer('cjs-types');
  writeFileSync(join(cjsTypesDir, 'index.cts'), `
import packageExports = require('cc-gram');
import type { FilterInstance } from 'cc-gram';

const filter: FilterInstance = packageExports.createFilter({ init: false });
const constructor: typeof packageExports.CCgram = packageExports.default;
void filter;
void constructor;
`.trimStart());
  writeJson(join(cjsTypesDir, 'tsconfig.json'), {
    compilerOptions: {
      lib: ['ES2023', 'DOM', 'DOM.Iterable'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: true,
      strict: true,
      target: 'ES2022',
      types: [],
    },
    include: ['index.cts'],
  });
  installTarball(cjsTypesDir, tarballPath);
  run(process.execPath, [resolve(rootDir, 'node_modules/typescript/bin/tsc'), '--project', 'tsconfig.json'], cjsTypesDir);
  console.log('CJS types: ok');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = error instanceof CommandError ? error.exitCode : 1;
} finally {
  rmSync(tempDir, { force: true, recursive: true });
}
