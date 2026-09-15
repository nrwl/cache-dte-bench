import { expect, test } from '@playwright/test';
import { ORDERS_OVERVIEW_FEATURE } from '@org/shop-feature-orders-overview';
import { ORDERS_SUMMARY_FEATURE } from '@org/shop-feature-orders-summary';
import { ORDERS_DETAILS_FEATURE } from '@org/shop-feature-orders-details';
import { ORDERS_HISTORY_FEATURE } from '@org/shop-feature-orders-history';
import { ORDERS_SETTINGS_FEATURE } from '@org/shop-feature-orders-settings';
import { ORDERS_EDITOR_FEATURE } from '@org/shop-feature-orders-editor';
import { ORDERS_LIST_FEATURE } from '@org/shop-feature-orders-list';
import { ORDERS_WIZARD_FEATURE } from '@org/shop-feature-orders-wizard';
import { ORDERS_DASHBOARD_FEATURE } from '@org/shop-feature-orders-dashboard';
import { ORDERS_INSIGHTS_FEATURE } from '@org/shop-feature-orders-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  ORDERS_OVERVIEW_FEATURE,
  ORDERS_SUMMARY_FEATURE,
  ORDERS_DETAILS_FEATURE,
  ORDERS_HISTORY_FEATURE,
  ORDERS_SETTINGS_FEATURE,
  ORDERS_EDITOR_FEATURE,
  ORDERS_LIST_FEATURE,
  ORDERS_WIZARD_FEATURE,
  ORDERS_DASHBOARD_FEATURE,
  ORDERS_INSIGHTS_FEATURE,
];

test.describe('Orders journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every orders feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every orders feature on the features index', async ({ page }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-orders');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first orders feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-orders')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
