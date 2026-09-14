import { expect, test } from '@playwright/test';
import { ANALYTICS_OVERVIEW_FEATURE } from '@org/shop-feature-analytics-overview';
import { ANALYTICS_SUMMARY_FEATURE } from '@org/shop-feature-analytics-summary';
import { ANALYTICS_DETAILS_FEATURE } from '@org/shop-feature-analytics-details';
import { ANALYTICS_HISTORY_FEATURE } from '@org/shop-feature-analytics-history';
import { ANALYTICS_SETTINGS_FEATURE } from '@org/shop-feature-analytics-settings';
import { ANALYTICS_EDITOR_FEATURE } from '@org/shop-feature-analytics-editor';
import { ANALYTICS_LIST_FEATURE } from '@org/shop-feature-analytics-list';
import { ANALYTICS_WIZARD_FEATURE } from '@org/shop-feature-analytics-wizard';
import { ANALYTICS_DASHBOARD_FEATURE } from '@org/shop-feature-analytics-dashboard';
import { ANALYTICS_INSIGHTS_FEATURE } from '@org/shop-feature-analytics-insights';

const DOMAIN_FEATURES = [
  ANALYTICS_OVERVIEW_FEATURE,
  ANALYTICS_SUMMARY_FEATURE,
  ANALYTICS_DETAILS_FEATURE,
  ANALYTICS_HISTORY_FEATURE,
  ANALYTICS_SETTINGS_FEATURE,
  ANALYTICS_EDITOR_FEATURE,
  ANALYTICS_LIST_FEATURE,
  ANALYTICS_WIZARD_FEATURE,
  ANALYTICS_DASHBOARD_FEATURE,
  ANALYTICS_INSIGHTS_FEATURE,
];

test.describe('Analytics journey', () => {
  test('walks through every analytics feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every analytics feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-analytics');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first analytics feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-analytics')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
