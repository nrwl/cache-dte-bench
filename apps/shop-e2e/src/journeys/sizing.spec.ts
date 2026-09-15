import { expect, test } from '@playwright/test';
import { SIZING_OVERVIEW_FEATURE } from '@org/shop-feature-sizing-overview';
import { SIZING_SUMMARY_FEATURE } from '@org/shop-feature-sizing-summary';
import { SIZING_DETAILS_FEATURE } from '@org/shop-feature-sizing-details';
import { SIZING_HISTORY_FEATURE } from '@org/shop-feature-sizing-history';
import { SIZING_SETTINGS_FEATURE } from '@org/shop-feature-sizing-settings';
import { SIZING_EDITOR_FEATURE } from '@org/shop-feature-sizing-editor';
import { SIZING_LIST_FEATURE } from '@org/shop-feature-sizing-list';
import { SIZING_WIZARD_FEATURE } from '@org/shop-feature-sizing-wizard';
import { SIZING_DASHBOARD_FEATURE } from '@org/shop-feature-sizing-dashboard';
import { SIZING_INSIGHTS_FEATURE } from '@org/shop-feature-sizing-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  SIZING_OVERVIEW_FEATURE,
  SIZING_SUMMARY_FEATURE,
  SIZING_DETAILS_FEATURE,
  SIZING_HISTORY_FEATURE,
  SIZING_SETTINGS_FEATURE,
  SIZING_EDITOR_FEATURE,
  SIZING_LIST_FEATURE,
  SIZING_WIZARD_FEATURE,
  SIZING_DASHBOARD_FEATURE,
  SIZING_INSIGHTS_FEATURE,
];

test.describe('Sizing journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every sizing feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every sizing feature on the features index', async ({ page }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-sizing');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first sizing feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-sizing')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
