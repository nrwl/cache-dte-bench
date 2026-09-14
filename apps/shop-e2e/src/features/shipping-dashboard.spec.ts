import { expect, test } from '@playwright/test';
import {
  SHIPPING_DASHBOARD_FEATURE,
  SHIPPING_DASHBOARD_ITEM_COUNT,
} from '@org/shop-feature-shipping-dashboard';

test.describe('Shipping Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SHIPPING_DASHBOARD_FEATURE.route);
    await expect(
      page.getByTestId(SHIPPING_DASHBOARD_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(SHIPPING_DASHBOARD_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(SHIPPING_DASHBOARD_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page
      .getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-clear`)
      .click();
    await expect(
      page.getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${SHIPPING_DASHBOARD_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
