import { expect, test } from '@playwright/test';
import { STORE_LOCATOR_OVERVIEW_FEATURE } from '@org/shop-feature-store-locator-overview';
import { STORE_LOCATOR_SUMMARY_FEATURE } from '@org/shop-feature-store-locator-summary';
import { STORE_LOCATOR_DETAILS_FEATURE } from '@org/shop-feature-store-locator-details';
import { STORE_LOCATOR_HISTORY_FEATURE } from '@org/shop-feature-store-locator-history';
import { STORE_LOCATOR_SETTINGS_FEATURE } from '@org/shop-feature-store-locator-settings';
import { STORE_LOCATOR_EDITOR_FEATURE } from '@org/shop-feature-store-locator-editor';
import { STORE_LOCATOR_LIST_FEATURE } from '@org/shop-feature-store-locator-list';
import { STORE_LOCATOR_WIZARD_FEATURE } from '@org/shop-feature-store-locator-wizard';
import { STORE_LOCATOR_DASHBOARD_FEATURE } from '@org/shop-feature-store-locator-dashboard';
import { STORE_LOCATOR_INSIGHTS_FEATURE } from '@org/shop-feature-store-locator-insights';

const DOMAIN_FEATURES = [
  STORE_LOCATOR_OVERVIEW_FEATURE,
  STORE_LOCATOR_SUMMARY_FEATURE,
  STORE_LOCATOR_DETAILS_FEATURE,
  STORE_LOCATOR_HISTORY_FEATURE,
  STORE_LOCATOR_SETTINGS_FEATURE,
  STORE_LOCATOR_EDITOR_FEATURE,
  STORE_LOCATOR_LIST_FEATURE,
  STORE_LOCATOR_WIZARD_FEATURE,
  STORE_LOCATOR_DASHBOARD_FEATURE,
  STORE_LOCATOR_INSIGHTS_FEATURE,
];

test.describe('Store Locator journey', () => {
  test('walks through every store-locator feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every store-locator feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-store-locator');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first store-locator feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-store-locator')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
