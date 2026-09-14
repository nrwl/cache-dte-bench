import { expect, test } from '@playwright/test';
import {
  COMPARE_DETAILS_FEATURE,
  COMPARE_DETAILS_ITEM_COUNT,
} from '@org/shop-feature-compare-details';

test.describe('Compare Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COMPARE_DETAILS_FEATURE.route);
    await expect(
      page.getByTestId(COMPARE_DETAILS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(COMPARE_DETAILS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(COMPARE_DETAILS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${COMPARE_DETAILS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
