import { expect, test } from '@playwright/test';
import { CHECKOUT_OVERVIEW_FEATURE } from '@org/shop-feature-checkout-overview';
import { CHECKOUT_SUMMARY_FEATURE } from '@org/shop-feature-checkout-summary';
import { CHECKOUT_DETAILS_FEATURE } from '@org/shop-feature-checkout-details';
import { CHECKOUT_HISTORY_FEATURE } from '@org/shop-feature-checkout-history';
import { CHECKOUT_SETTINGS_FEATURE } from '@org/shop-feature-checkout-settings';
import { CHECKOUT_EDITOR_FEATURE } from '@org/shop-feature-checkout-editor';
import { CHECKOUT_LIST_FEATURE } from '@org/shop-feature-checkout-list';
import { CHECKOUT_WIZARD_FEATURE } from '@org/shop-feature-checkout-wizard';
import { CHECKOUT_DASHBOARD_FEATURE } from '@org/shop-feature-checkout-dashboard';
import { CHECKOUT_INSIGHTS_FEATURE } from '@org/shop-feature-checkout-insights';

const DOMAIN_FEATURES = [
  CHECKOUT_OVERVIEW_FEATURE,
  CHECKOUT_SUMMARY_FEATURE,
  CHECKOUT_DETAILS_FEATURE,
  CHECKOUT_HISTORY_FEATURE,
  CHECKOUT_SETTINGS_FEATURE,
  CHECKOUT_EDITOR_FEATURE,
  CHECKOUT_LIST_FEATURE,
  CHECKOUT_WIZARD_FEATURE,
  CHECKOUT_DASHBOARD_FEATURE,
  CHECKOUT_INSIGHTS_FEATURE,
];

test.describe('Checkout journey', () => {
  test('walks through every checkout feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every checkout feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-checkout');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first checkout feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-checkout')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
