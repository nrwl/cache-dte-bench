import { expect, test } from '@playwright/test';
import {
  TRACKING_INSIGHTS_FEATURE,
  TRACKING_INSIGHTS_ITEM_COUNT,
} from '@org/shop-feature-tracking-insights';

test.describe('Tracking Insights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TRACKING_INSIGHTS_FEATURE.route);
    await expect(
      page.getByTestId(TRACKING_INSIGHTS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(TRACKING_INSIGHTS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(TRACKING_INSIGHTS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${TRACKING_INSIGHTS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
