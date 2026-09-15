import { expect, test } from '@playwright/test';
import {
  REVIEWS_DETAILS_FEATURE,
  REVIEWS_DETAILS_ITEM_COUNT,
} from '@org/shop-feature-reviews-details';
import { pace } from '../support/pacing';

test.describe('Reviews Details', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(REVIEWS_DETAILS_FEATURE.route);
    await expect(
      page.getByTestId(REVIEWS_DETAILS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(REVIEWS_DETAILS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(REVIEWS_DETAILS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${REVIEWS_DETAILS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
