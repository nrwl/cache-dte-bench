import { expect, test } from '@playwright/test';
import { SHIPPING_OVERVIEW_FEATURE } from '@org/shop-feature-shipping-overview';
import { SHIPPING_SUMMARY_FEATURE } from '@org/shop-feature-shipping-summary';
import { SHIPPING_DETAILS_FEATURE } from '@org/shop-feature-shipping-details';
import { SHIPPING_HISTORY_FEATURE } from '@org/shop-feature-shipping-history';
import { SHIPPING_SETTINGS_FEATURE } from '@org/shop-feature-shipping-settings';
import { SHIPPING_EDITOR_FEATURE } from '@org/shop-feature-shipping-editor';
import { SHIPPING_LIST_FEATURE } from '@org/shop-feature-shipping-list';
import { SHIPPING_WIZARD_FEATURE } from '@org/shop-feature-shipping-wizard';
import { SHIPPING_DASHBOARD_FEATURE } from '@org/shop-feature-shipping-dashboard';
import { SHIPPING_INSIGHTS_FEATURE } from '@org/shop-feature-shipping-insights';

const DOMAIN_FEATURES = [
  SHIPPING_OVERVIEW_FEATURE,
  SHIPPING_SUMMARY_FEATURE,
  SHIPPING_DETAILS_FEATURE,
  SHIPPING_HISTORY_FEATURE,
  SHIPPING_SETTINGS_FEATURE,
  SHIPPING_EDITOR_FEATURE,
  SHIPPING_LIST_FEATURE,
  SHIPPING_WIZARD_FEATURE,
  SHIPPING_DASHBOARD_FEATURE,
  SHIPPING_INSIGHTS_FEATURE,
];

test.describe('Shipping journey', () => {
  test('walks through every shipping feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every shipping feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-shipping');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first shipping feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-shipping')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
