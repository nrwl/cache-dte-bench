import { expect, test } from '@playwright/test';
import {
  PREORDERS_HISTORY_FEATURE,
  PREORDERS_HISTORY_ITEM_COUNT,
} from '@org/shop-feature-preorders-history';
import { pace } from '../support/pacing';

test.describe('Preorders History', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(PREORDERS_HISTORY_FEATURE.route);
    await expect(
      page.getByTestId(PREORDERS_HISTORY_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(PREORDERS_HISTORY_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(PREORDERS_HISTORY_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${PREORDERS_HISTORY_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
