import { expect, test } from '@playwright/test';
import { PROMOTIONS_OVERVIEW_FEATURE } from '@org/shop-feature-promotions-overview';
import { PROMOTIONS_SUMMARY_FEATURE } from '@org/shop-feature-promotions-summary';
import { PROMOTIONS_DETAILS_FEATURE } from '@org/shop-feature-promotions-details';
import { PROMOTIONS_HISTORY_FEATURE } from '@org/shop-feature-promotions-history';
import { PROMOTIONS_SETTINGS_FEATURE } from '@org/shop-feature-promotions-settings';
import { PROMOTIONS_EDITOR_FEATURE } from '@org/shop-feature-promotions-editor';
import { PROMOTIONS_LIST_FEATURE } from '@org/shop-feature-promotions-list';
import { PROMOTIONS_WIZARD_FEATURE } from '@org/shop-feature-promotions-wizard';
import { PROMOTIONS_DASHBOARD_FEATURE } from '@org/shop-feature-promotions-dashboard';
import { PROMOTIONS_INSIGHTS_FEATURE } from '@org/shop-feature-promotions-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  PROMOTIONS_OVERVIEW_FEATURE,
  PROMOTIONS_SUMMARY_FEATURE,
  PROMOTIONS_DETAILS_FEATURE,
  PROMOTIONS_HISTORY_FEATURE,
  PROMOTIONS_SETTINGS_FEATURE,
  PROMOTIONS_EDITOR_FEATURE,
  PROMOTIONS_LIST_FEATURE,
  PROMOTIONS_WIZARD_FEATURE,
  PROMOTIONS_DASHBOARD_FEATURE,
  PROMOTIONS_INSIGHTS_FEATURE,
];

test.describe('Promotions journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every promotions feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every promotions feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-promotions');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first promotions feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-promotions')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
