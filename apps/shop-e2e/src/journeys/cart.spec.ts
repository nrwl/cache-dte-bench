import { expect, test } from '@playwright/test';
import { CART_OVERVIEW_FEATURE } from '@org/shop-feature-cart-overview';
import { CART_SUMMARY_FEATURE } from '@org/shop-feature-cart-summary';
import { CART_DETAILS_FEATURE } from '@org/shop-feature-cart-details';
import { CART_HISTORY_FEATURE } from '@org/shop-feature-cart-history';
import { CART_SETTINGS_FEATURE } from '@org/shop-feature-cart-settings';
import { CART_EDITOR_FEATURE } from '@org/shop-feature-cart-editor';
import { CART_LIST_FEATURE } from '@org/shop-feature-cart-list';
import { CART_WIZARD_FEATURE } from '@org/shop-feature-cart-wizard';
import { CART_DASHBOARD_FEATURE } from '@org/shop-feature-cart-dashboard';
import { CART_INSIGHTS_FEATURE } from '@org/shop-feature-cart-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  CART_OVERVIEW_FEATURE,
  CART_SUMMARY_FEATURE,
  CART_DETAILS_FEATURE,
  CART_HISTORY_FEATURE,
  CART_SETTINGS_FEATURE,
  CART_EDITOR_FEATURE,
  CART_LIST_FEATURE,
  CART_WIZARD_FEATURE,
  CART_DASHBOARD_FEATURE,
  CART_INSIGHTS_FEATURE,
];

test.describe('Cart journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every cart feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every cart feature on the features index', async ({ page }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-cart');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first cart feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-cart')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
