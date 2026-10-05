import { expect, test, type Page } from '@playwright/test';

import type { E2EApi } from '../demo/src/e2e';

const EXPECTED_PIXELS = [
  0, 0, 0, 0,
  255, 0, 0, 255,
  0, 255, 0, 255,
  0, 0, 255, 255,
];

const INVERTED_PIXELS = [
  0, 0, 0, 0,
  0, 255, 255, 255,
  255, 0, 255, 255,
  255, 255, 0, 255,
];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

async function openFixture(page: Page): Promise<void> {
  await page.goto('e2e.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
}

async function render(page: Page): Promise<Awaited<ReturnType<E2EApi['render']>>> {
  return page.evaluate(() => window.ccgramE2E.render());
}

function expectPixels(result: Awaited<ReturnType<E2EApi['render']>>, pixels = EXPECTED_PIXELS): void {
  expect(result.type).toBe('image/png');
  expect(result.width).toBe(2);
  expect(result.height).toBe(2);
  expect(result.pixels).toEqual(pixels);
  expect(result.pixels[3]).toBe(0);
  expect(result.pixels[7]).toBe(255);
}

async function disableCanvasFilters(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Reflect.deleteProperty(CanvasRenderingContext2D.prototype, 'filter');

    // Workers have their own global scope. Prepend the same capability removal
    // to the library's real Worker script rather than mocking its responses.
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (object) => createObjectURL(
      object instanceof Blob && object.type === 'text/javascript'
        ? new Blob([
          "Reflect.deleteProperty(OffscreenCanvasRenderingContext2D.prototype, 'filter');\n",
          object,
        ], { type: object.type })
        : object,
    );
  });
}

function testFilteredExports(mode: 'worker' | 'fallback'): void {
  test('exports inverted pixels, preserving transparency', async ({ page }) => {
    const errors = collectErrors(page);
    await openFixture(page);
    const result = await page.evaluate(() => window.ccgramE2E.render('invert'));

    expect(result.mode).toBe(mode);
    expectPixels(result, INVERTED_PIXELS);
    expect(errors).toEqual([]);
  });

  test('rejects filtered exports when canvas filter support is removed', async ({ page }) => {
    const errors = collectErrors(page);
    await disableCanvasFilters(page);
    await openFixture(page);
    const rejection = await page.evaluate(async () => {
      try {
        await window.ccgramE2E.render('invert');
        return null;
      } catch (error) {
        return error instanceof Error ? { name: error.name, message: error.message } : null;
      }
    });

    expect(rejection).toEqual({ name: 'Error', message: '[CCgram] Canvas filters are not supported.' });
    expect(errors).toEqual([]);
  });

  test('exports original pixels without canvas filter support when no filter is requested', async ({ page }) => {
    const errors = collectErrors(page);
    await disableCanvasFilters(page);
    await openFixture(page);
    const result = await render(page);

    expect(result.mode).toBe(mode);
    expectPixels(result);
    expect(errors).toEqual([]);
  });
}

test.describe('Worker render path', () => {
  testFilteredExports('worker');

  test('renders exact transparent and opaque PNG pixels', async ({ page }) => {
    const errors = collectErrors(page);
    await openFixture(page);

    const result = await render(page);

    expect(result.mode).toBe('worker');
    expectPixels(result);
    expect(errors).toEqual([]);
  });

  test('serializes a rejecting async Worker task', async ({ page }) => {
    const errors = collectErrors(page);
    await openFixture(page);

    const rejection = await page.evaluate(async () => {
      try {
        await window.ccgramE2E.rejectInWorker();
        return null;
      } catch (error) {
        return error instanceof Error
          ? { name: error.name, message: error.message }
          : { name: typeof error, message: String(error) };
      }
    });

    expect(rejection).toEqual({
      name: 'DeliberateWorkerError',
      message: '[CCgram] Deliberate async Worker rejection.',
    });
    expect(errors).toEqual([]);
  });
});

test.describe('Fallback render path', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(globalThis, 'OffscreenCanvas', {
        configurable: true,
        value: undefined,
        writable: true,
      });
    });
  });

  testFilteredExports('fallback');

  test('renders exact transparent and opaque PNG pixels', async ({ page }) => {
    const errors = collectErrors(page);
    await openFixture(page);

    const result = await render(page);

    expect(result.mode).toBe('fallback');
    expectPixels(result);
    expect(errors).toEqual([]);
  });
});
