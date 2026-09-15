import { expect, test } from '@playwright/test';
import { RECOMMENDATIONS_OVERVIEW_FEATURE } from '@org/shop-feature-recommendations-overview';
import { RECOMMENDATIONS_SUMMARY_FEATURE } from '@org/shop-feature-recommendations-summary';
import { RECOMMENDATIONS_DETAILS_FEATURE } from '@org/shop-feature-recommendations-details';
import { RECOMMENDATIONS_HISTORY_FEATURE } from '@org/shop-feature-recommendations-history';
import { RECOMMENDATIONS_SETTINGS_FEATURE } from '@org/shop-feature-recommendations-settings';
import { RECOMMENDATIONS_EDITOR_FEATURE } from '@org/shop-feature-recommendations-editor';
import { RECOMMENDATIONS_LIST_FEATURE } from '@org/shop-feature-recommendations-list';
import { RECOMMENDATIONS_WIZARD_FEATURE } from '@org/shop-feature-recommendations-wizard';
import { RECOMMENDATIONS_DASHBOARD_FEATURE } from '@org/shop-feature-recommendations-dashboard';
import { RECOMMENDATIONS_INSIGHTS_FEATURE } from '@org/shop-feature-recommendations-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  RECOMMENDATIONS_OVERVIEW_FEATURE,
  RECOMMENDATIONS_SUMMARY_FEATURE,
  RECOMMENDATIONS_DETAILS_FEATURE,
  RECOMMENDATIONS_HISTORY_FEATURE,
  RECOMMENDATIONS_SETTINGS_FEATURE,
  RECOMMENDATIONS_EDITOR_FEATURE,
  RECOMMENDATIONS_LIST_FEATURE,
  RECOMMENDATIONS_WIZARD_FEATURE,
  RECOMMENDATIONS_DASHBOARD_FEATURE,
  RECOMMENDATIONS_INSIGHTS_FEATURE,
];

test.describe('Recommendations journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every recommendations feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every recommendations feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-recommendations');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first recommendations feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-recommendations')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
