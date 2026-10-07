import { expect, test } from '@playwright/test';

test('selects demo filters with Tab, Enter, Space and pointer activation', async ({ page }) => {
  // Keep this interaction test independent of the demo's external logo and fonts.
  await page.route('https://**/*', (route) => route.abort());
  await page.goto('./');
  await page.locator('input[type="file"]').setInputFiles('e2e/fixtures/render-2x2.png');

  const selectors = page.locator('.filters-container').getByRole('button');
  const first = selectors.nth(0);
  const second = selectors.nth(1);
  const preview = page.locator('#preview-image');

  await expect(preview).toBeVisible();
  await expect(first).toHaveAccessibleName('ADEN');
  await expect(second).toHaveAccessibleName('INKWELL');
  await expect(selectors.locator('img').first()).toBeVisible();
  await expect(page.locator('.filters-container [aria-pressed="true"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Download image', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();
  expect(await first.evaluate((button) => {
    const style = getComputedStyle(button);
    return button.matches(':focus-visible') && style.outlineStyle === 'solid'
      && Number.parseFloat(style.outlineWidth) >= 2;
  })).toBe(true);

  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(preview).toHaveAttribute('data-filter', 'aden');
  await expect(preview).toHaveCSS('filter', 'hue-rotate(-20deg) contrast(0.9) brightness(1.2) saturate(0.85)');

  await page.keyboard.press('Tab');
  await expect(second).toBeFocused();
  // Unrelated keys must not select a filter.
  await page.keyboard.press('a');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await expect(preview).toHaveAttribute('data-filter', 'inkwell');
  await expect(preview).toHaveCSS('filter', 'sepia(0.3) contrast(1.1) brightness(1.1) grayscale(1)');

  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(second).toHaveAttribute('aria-pressed', 'false');
  await expect(preview).toHaveAttribute('data-filter', 'aden');
  await expect(preview).toHaveCSS('filter', 'hue-rotate(-20deg) contrast(0.9) brightness(1.2) saturate(0.85)');
  await expect(page.locator('.filters-container [aria-pressed="true"]')).toHaveCount(1);
});
