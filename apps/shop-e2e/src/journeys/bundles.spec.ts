import { expect, test } from '@playwright/test';
import { BUNDLES_OVERVIEW_FEATURE } from '@org/shop-feature-bundles-overview';
import { BUNDLES_SUMMARY_FEATURE } from '@org/shop-feature-bundles-summary';
import { BUNDLES_DETAILS_FEATURE } from '@org/shop-feature-bundles-details';
import { BUNDLES_HISTORY_FEATURE } from '@org/shop-feature-bundles-history';
import { BUNDLES_SETTINGS_FEATURE } from '@org/shop-feature-bundles-settings';
import { BUNDLES_EDITOR_FEATURE } from '@org/shop-feature-bundles-editor';
import { BUNDLES_LIST_FEATURE } from '@org/shop-feature-bundles-list';
import { BUNDLES_WIZARD_FEATURE } from '@org/shop-feature-bundles-wizard';
import { BUNDLES_DASHBOARD_FEATURE } from '@org/shop-feature-bundles-dashboard';
import { BUNDLES_INSIGHTS_FEATURE } from '@org/shop-feature-bundles-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  BUNDLES_OVERVIEW_FEATURE,
  BUNDLES_SUMMARY_FEATURE,
  BUNDLES_DETAILS_FEATURE,
  BUNDLES_HISTORY_FEATURE,
  BUNDLES_SETTINGS_FEATURE,
  BUNDLES_EDITOR_FEATURE,
  BUNDLES_LIST_FEATURE,
  BUNDLES_WIZARD_FEATURE,
  BUNDLES_DASHBOARD_FEATURE,
  BUNDLES_INSIGHTS_FEATURE,
];

test.describe('Bundles journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every bundles feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every bundles feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-bundles');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first bundles feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-bundles')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
