import { expect, test } from '@playwright/test';
import { REVIEWS_OVERVIEW_FEATURE } from '@org/shop-feature-reviews-overview';
import { REVIEWS_SUMMARY_FEATURE } from '@org/shop-feature-reviews-summary';
import { REVIEWS_DETAILS_FEATURE } from '@org/shop-feature-reviews-details';
import { REVIEWS_HISTORY_FEATURE } from '@org/shop-feature-reviews-history';
import { REVIEWS_SETTINGS_FEATURE } from '@org/shop-feature-reviews-settings';
import { REVIEWS_EDITOR_FEATURE } from '@org/shop-feature-reviews-editor';
import { REVIEWS_LIST_FEATURE } from '@org/shop-feature-reviews-list';
import { REVIEWS_WIZARD_FEATURE } from '@org/shop-feature-reviews-wizard';
import { REVIEWS_DASHBOARD_FEATURE } from '@org/shop-feature-reviews-dashboard';
import { REVIEWS_INSIGHTS_FEATURE } from '@org/shop-feature-reviews-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  REVIEWS_OVERVIEW_FEATURE,
  REVIEWS_SUMMARY_FEATURE,
  REVIEWS_DETAILS_FEATURE,
  REVIEWS_HISTORY_FEATURE,
  REVIEWS_SETTINGS_FEATURE,
  REVIEWS_EDITOR_FEATURE,
  REVIEWS_LIST_FEATURE,
  REVIEWS_WIZARD_FEATURE,
  REVIEWS_DASHBOARD_FEATURE,
  REVIEWS_INSIGHTS_FEATURE,
];

test.describe('Reviews journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every reviews feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every reviews feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-reviews');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first reviews feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-reviews')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
