import { expect, test } from '@playwright/test';
import {
  CHECKOUT_OVERVIEW_FEATURE,
  CHECKOUT_OVERVIEW_ITEM_COUNT,
} from '@org/shop-feature-checkout-overview';

test.describe('Checkout Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CHECKOUT_OVERVIEW_FEATURE.route);
    await expect(
      page.getByTestId(CHECKOUT_OVERVIEW_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(CHECKOUT_OVERVIEW_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(CHECKOUT_OVERVIEW_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${CHECKOUT_OVERVIEW_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
