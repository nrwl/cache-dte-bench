import { expect, test } from '@playwright/test';
import { SEARCH_OVERVIEW_FEATURE } from '@org/shop-feature-search-overview';
import { SEARCH_SUMMARY_FEATURE } from '@org/shop-feature-search-summary';
import { SEARCH_DETAILS_FEATURE } from '@org/shop-feature-search-details';
import { SEARCH_HISTORY_FEATURE } from '@org/shop-feature-search-history';
import { SEARCH_SETTINGS_FEATURE } from '@org/shop-feature-search-settings';
import { SEARCH_EDITOR_FEATURE } from '@org/shop-feature-search-editor';
import { SEARCH_LIST_FEATURE } from '@org/shop-feature-search-list';
import { SEARCH_WIZARD_FEATURE } from '@org/shop-feature-search-wizard';
import { SEARCH_DASHBOARD_FEATURE } from '@org/shop-feature-search-dashboard';
import { SEARCH_INSIGHTS_FEATURE } from '@org/shop-feature-search-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  SEARCH_OVERVIEW_FEATURE,
  SEARCH_SUMMARY_FEATURE,
  SEARCH_DETAILS_FEATURE,
  SEARCH_HISTORY_FEATURE,
  SEARCH_SETTINGS_FEATURE,
  SEARCH_EDITOR_FEATURE,
  SEARCH_LIST_FEATURE,
  SEARCH_WIZARD_FEATURE,
  SEARCH_DASHBOARD_FEATURE,
  SEARCH_INSIGHTS_FEATURE,
];

test.describe('Search journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every search feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every search feature on the features index', async ({ page }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-search');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first search feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-search')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
