import { expect, test } from '@playwright/test';
import {
  TRACKING_LIST_FEATURE,
  TRACKING_LIST_ITEM_COUNT,
} from '@org/shop-feature-tracking-list';
import { pace } from '../support/pacing';

test.describe('Tracking List', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(TRACKING_LIST_FEATURE.route);
    await expect(page.getByTestId(TRACKING_LIST_FEATURE.testId)).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${TRACKING_LIST_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(TRACKING_LIST_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(TRACKING_LIST_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${TRACKING_LIST_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${TRACKING_LIST_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${TRACKING_LIST_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
