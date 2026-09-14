import { expect, test } from '@playwright/test';
import { TRACKING_OVERVIEW_FEATURE } from '@org/shop-feature-tracking-overview';
import { TRACKING_SUMMARY_FEATURE } from '@org/shop-feature-tracking-summary';
import { TRACKING_DETAILS_FEATURE } from '@org/shop-feature-tracking-details';
import { TRACKING_HISTORY_FEATURE } from '@org/shop-feature-tracking-history';
import { TRACKING_SETTINGS_FEATURE } from '@org/shop-feature-tracking-settings';
import { TRACKING_EDITOR_FEATURE } from '@org/shop-feature-tracking-editor';
import { TRACKING_LIST_FEATURE } from '@org/shop-feature-tracking-list';
import { TRACKING_WIZARD_FEATURE } from '@org/shop-feature-tracking-wizard';
import { TRACKING_DASHBOARD_FEATURE } from '@org/shop-feature-tracking-dashboard';
import { TRACKING_INSIGHTS_FEATURE } from '@org/shop-feature-tracking-insights';

const DOMAIN_FEATURES = [
  TRACKING_OVERVIEW_FEATURE,
  TRACKING_SUMMARY_FEATURE,
  TRACKING_DETAILS_FEATURE,
  TRACKING_HISTORY_FEATURE,
  TRACKING_SETTINGS_FEATURE,
  TRACKING_EDITOR_FEATURE,
  TRACKING_LIST_FEATURE,
  TRACKING_WIZARD_FEATURE,
  TRACKING_DASHBOARD_FEATURE,
  TRACKING_INSIGHTS_FEATURE,
];

test.describe('Tracking journey', () => {
  test('walks through every tracking feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every tracking feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-tracking');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first tracking feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-tracking')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
