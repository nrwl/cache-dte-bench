import { expect, test } from '@playwright/test';
import {
  COMPARE_LIST_FEATURE,
  COMPARE_LIST_ITEM_COUNT,
} from '@org/shop-feature-compare-list';

test.describe('Compare List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COMPARE_LIST_FEATURE.route);
    await expect(page.getByTestId(COMPARE_LIST_FEATURE.testId)).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${COMPARE_LIST_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(COMPARE_LIST_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(COMPARE_LIST_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${COMPARE_LIST_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${COMPARE_LIST_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${COMPARE_LIST_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
