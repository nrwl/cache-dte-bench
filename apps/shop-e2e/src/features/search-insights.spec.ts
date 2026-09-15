import { expect, test } from '@playwright/test';
import {
  SEARCH_INSIGHTS_FEATURE,
  SEARCH_INSIGHTS_ITEM_COUNT,
} from '@org/shop-feature-search-insights';
import { pace } from '../support/pacing';

test.describe('Search Insights', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(SEARCH_INSIGHTS_FEATURE.route);
    await expect(
      page.getByTestId(SEARCH_INSIGHTS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(SEARCH_INSIGHTS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(SEARCH_INSIGHTS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${SEARCH_INSIGHTS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
