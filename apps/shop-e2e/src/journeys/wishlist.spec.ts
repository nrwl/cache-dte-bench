import { expect, test } from '@playwright/test';
import { WISHLIST_OVERVIEW_FEATURE } from '@org/shop-feature-wishlist-overview';
import { WISHLIST_SUMMARY_FEATURE } from '@org/shop-feature-wishlist-summary';
import { WISHLIST_DETAILS_FEATURE } from '@org/shop-feature-wishlist-details';
import { WISHLIST_HISTORY_FEATURE } from '@org/shop-feature-wishlist-history';
import { WISHLIST_SETTINGS_FEATURE } from '@org/shop-feature-wishlist-settings';
import { WISHLIST_EDITOR_FEATURE } from '@org/shop-feature-wishlist-editor';
import { WISHLIST_LIST_FEATURE } from '@org/shop-feature-wishlist-list';
import { WISHLIST_WIZARD_FEATURE } from '@org/shop-feature-wishlist-wizard';
import { WISHLIST_DASHBOARD_FEATURE } from '@org/shop-feature-wishlist-dashboard';
import { WISHLIST_INSIGHTS_FEATURE } from '@org/shop-feature-wishlist-insights';

const DOMAIN_FEATURES = [
  WISHLIST_OVERVIEW_FEATURE,
  WISHLIST_SUMMARY_FEATURE,
  WISHLIST_DETAILS_FEATURE,
  WISHLIST_HISTORY_FEATURE,
  WISHLIST_SETTINGS_FEATURE,
  WISHLIST_EDITOR_FEATURE,
  WISHLIST_LIST_FEATURE,
  WISHLIST_WIZARD_FEATURE,
  WISHLIST_DASHBOARD_FEATURE,
  WISHLIST_INSIGHTS_FEATURE,
];

test.describe('Wishlist journey', () => {
  test('walks through every wishlist feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every wishlist feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-wishlist');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first wishlist feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-wishlist')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
