import { expect, test } from '@playwright/test';
import {
  PAYMENTS_OVERVIEW_FEATURE,
  PAYMENTS_OVERVIEW_ITEM_COUNT,
} from '@org/shop-feature-payments-overview';

test.describe('Payments Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAYMENTS_OVERVIEW_FEATURE.route);
    await expect(
      page.getByTestId(PAYMENTS_OVERVIEW_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(PAYMENTS_OVERVIEW_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(PAYMENTS_OVERVIEW_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${PAYMENTS_OVERVIEW_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
