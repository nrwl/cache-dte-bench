import { expect, test } from '@playwright/test';
import { ADDRESSES_OVERVIEW_FEATURE } from '@org/shop-feature-addresses-overview';
import { ADDRESSES_SUMMARY_FEATURE } from '@org/shop-feature-addresses-summary';
import { ADDRESSES_DETAILS_FEATURE } from '@org/shop-feature-addresses-details';
import { ADDRESSES_HISTORY_FEATURE } from '@org/shop-feature-addresses-history';
import { ADDRESSES_SETTINGS_FEATURE } from '@org/shop-feature-addresses-settings';
import { ADDRESSES_EDITOR_FEATURE } from '@org/shop-feature-addresses-editor';
import { ADDRESSES_LIST_FEATURE } from '@org/shop-feature-addresses-list';
import { ADDRESSES_WIZARD_FEATURE } from '@org/shop-feature-addresses-wizard';
import { ADDRESSES_DASHBOARD_FEATURE } from '@org/shop-feature-addresses-dashboard';
import { ADDRESSES_INSIGHTS_FEATURE } from '@org/shop-feature-addresses-insights';

const DOMAIN_FEATURES = [
  ADDRESSES_OVERVIEW_FEATURE,
  ADDRESSES_SUMMARY_FEATURE,
  ADDRESSES_DETAILS_FEATURE,
  ADDRESSES_HISTORY_FEATURE,
  ADDRESSES_SETTINGS_FEATURE,
  ADDRESSES_EDITOR_FEATURE,
  ADDRESSES_LIST_FEATURE,
  ADDRESSES_WIZARD_FEATURE,
  ADDRESSES_DASHBOARD_FEATURE,
  ADDRESSES_INSIGHTS_FEATURE,
];

test.describe('Addresses journey', () => {
  test('walks through every addresses feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every addresses feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-addresses');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first addresses feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-addresses')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
