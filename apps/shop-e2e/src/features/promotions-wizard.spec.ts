import { expect, test } from '@playwright/test';
import {
  PROMOTIONS_WIZARD_FEATURE,
  PROMOTIONS_WIZARD_ITEM_COUNT,
} from '@org/shop-feature-promotions-wizard';
import { pace } from '../support/pacing';

test.describe('Promotions Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(PROMOTIONS_WIZARD_FEATURE.route);
    await expect(
      page.getByTestId(PROMOTIONS_WIZARD_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(PROMOTIONS_WIZARD_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(PROMOTIONS_WIZARD_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${PROMOTIONS_WIZARD_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
