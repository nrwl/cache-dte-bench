import { expect, test } from '@playwright/test';
import { NOTIFICATIONS_OVERVIEW_FEATURE } from '@org/shop-feature-notifications-overview';
import { NOTIFICATIONS_SUMMARY_FEATURE } from '@org/shop-feature-notifications-summary';
import { NOTIFICATIONS_DETAILS_FEATURE } from '@org/shop-feature-notifications-details';
import { NOTIFICATIONS_HISTORY_FEATURE } from '@org/shop-feature-notifications-history';
import { NOTIFICATIONS_SETTINGS_FEATURE } from '@org/shop-feature-notifications-settings';
import { NOTIFICATIONS_EDITOR_FEATURE } from '@org/shop-feature-notifications-editor';
import { NOTIFICATIONS_LIST_FEATURE } from '@org/shop-feature-notifications-list';
import { NOTIFICATIONS_WIZARD_FEATURE } from '@org/shop-feature-notifications-wizard';
import { NOTIFICATIONS_DASHBOARD_FEATURE } from '@org/shop-feature-notifications-dashboard';
import { NOTIFICATIONS_INSIGHTS_FEATURE } from '@org/shop-feature-notifications-insights';

const DOMAIN_FEATURES = [
  NOTIFICATIONS_OVERVIEW_FEATURE,
  NOTIFICATIONS_SUMMARY_FEATURE,
  NOTIFICATIONS_DETAILS_FEATURE,
  NOTIFICATIONS_HISTORY_FEATURE,
  NOTIFICATIONS_SETTINGS_FEATURE,
  NOTIFICATIONS_EDITOR_FEATURE,
  NOTIFICATIONS_LIST_FEATURE,
  NOTIFICATIONS_WIZARD_FEATURE,
  NOTIFICATIONS_DASHBOARD_FEATURE,
  NOTIFICATIONS_INSIGHTS_FEATURE,
];

test.describe('Notifications journey', () => {
  test('walks through every notifications feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every notifications feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-notifications');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first notifications feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-notifications')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
