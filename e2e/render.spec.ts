import { expect, test, type Page } from '@playwright/test';

import type { E2EApi } from '../demo/src/e2e';

const EXPECTED_PIXELS = [
  0, 0, 0, 0,
  255, 0, 0, 255,
  0, 255, 0, 255,
  0, 0, 255, 255,
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

function expectPixels(result: Awaited<ReturnType<E2EApi['render']>>): void {
  expect(result.type).toBe('image/png');
  expect(result.width).toBe(2);
  expect(result.height).toBe(2);
  expect(result.pixels).toEqual(EXPECTED_PIXELS);
  expect(result.pixels[3]).toBe(0);
  expect(result.pixels[7]).toBe(255);
}

test.describe('Worker render path', () => {
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

  test('renders exact transparent and opaque PNG pixels', async ({ page }) => {
    const errors = collectErrors(page);
    await openFixture(page);

    const result = await render(page);

    expect(result.mode).toBe('fallback');
    expectPixels(result);
    expect(errors).toEqual([]);
  });
});
