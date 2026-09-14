import { expect, test } from '@playwright/test';
import {
  BUNDLES_WIZARD_FEATURE,
  BUNDLES_WIZARD_ITEM_COUNT,
} from '@org/shop-feature-bundles-wizard';

test.describe('Bundles Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BUNDLES_WIZARD_FEATURE.route);
    await expect(page.getByTestId(BUNDLES_WIZARD_FEATURE.testId)).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(BUNDLES_WIZARD_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(BUNDLES_WIZARD_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${BUNDLES_WIZARD_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
