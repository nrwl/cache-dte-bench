import { expect, test } from '@playwright/test';
import { SUBSCRIPTIONS_OVERVIEW_FEATURE } from '@org/shop-feature-subscriptions-overview';
import { SUBSCRIPTIONS_SUMMARY_FEATURE } from '@org/shop-feature-subscriptions-summary';
import { SUBSCRIPTIONS_DETAILS_FEATURE } from '@org/shop-feature-subscriptions-details';
import { SUBSCRIPTIONS_HISTORY_FEATURE } from '@org/shop-feature-subscriptions-history';
import { SUBSCRIPTIONS_SETTINGS_FEATURE } from '@org/shop-feature-subscriptions-settings';
import { SUBSCRIPTIONS_EDITOR_FEATURE } from '@org/shop-feature-subscriptions-editor';
import { SUBSCRIPTIONS_LIST_FEATURE } from '@org/shop-feature-subscriptions-list';
import { SUBSCRIPTIONS_WIZARD_FEATURE } from '@org/shop-feature-subscriptions-wizard';
import { SUBSCRIPTIONS_DASHBOARD_FEATURE } from '@org/shop-feature-subscriptions-dashboard';
import { SUBSCRIPTIONS_INSIGHTS_FEATURE } from '@org/shop-feature-subscriptions-insights';

const DOMAIN_FEATURES = [
  SUBSCRIPTIONS_OVERVIEW_FEATURE,
  SUBSCRIPTIONS_SUMMARY_FEATURE,
  SUBSCRIPTIONS_DETAILS_FEATURE,
  SUBSCRIPTIONS_HISTORY_FEATURE,
  SUBSCRIPTIONS_SETTINGS_FEATURE,
  SUBSCRIPTIONS_EDITOR_FEATURE,
  SUBSCRIPTIONS_LIST_FEATURE,
  SUBSCRIPTIONS_WIZARD_FEATURE,
  SUBSCRIPTIONS_DASHBOARD_FEATURE,
  SUBSCRIPTIONS_INSIGHTS_FEATURE,
];

test.describe('Subscriptions journey', () => {
  test('walks through every subscriptions feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every subscriptions feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-subscriptions');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first subscriptions feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-subscriptions')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
