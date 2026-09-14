import { expect, test } from '@playwright/test';
import {
  WISHLIST_INSIGHTS_FEATURE,
  WISHLIST_INSIGHTS_ITEM_COUNT,
} from '@org/shop-feature-wishlist-insights';

test.describe('Wishlist Insights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WISHLIST_INSIGHTS_FEATURE.route);
    await expect(
      page.getByTestId(WISHLIST_INSIGHTS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(WISHLIST_INSIGHTS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(WISHLIST_INSIGHTS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${WISHLIST_INSIGHTS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
