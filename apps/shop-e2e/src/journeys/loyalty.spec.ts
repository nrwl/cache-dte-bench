import { expect, test } from '@playwright/test';
import { LOYALTY_OVERVIEW_FEATURE } from '@org/shop-feature-loyalty-overview';
import { LOYALTY_SUMMARY_FEATURE } from '@org/shop-feature-loyalty-summary';
import { LOYALTY_DETAILS_FEATURE } from '@org/shop-feature-loyalty-details';
import { LOYALTY_HISTORY_FEATURE } from '@org/shop-feature-loyalty-history';
import { LOYALTY_SETTINGS_FEATURE } from '@org/shop-feature-loyalty-settings';
import { LOYALTY_EDITOR_FEATURE } from '@org/shop-feature-loyalty-editor';
import { LOYALTY_LIST_FEATURE } from '@org/shop-feature-loyalty-list';
import { LOYALTY_WIZARD_FEATURE } from '@org/shop-feature-loyalty-wizard';
import { LOYALTY_DASHBOARD_FEATURE } from '@org/shop-feature-loyalty-dashboard';
import { LOYALTY_INSIGHTS_FEATURE } from '@org/shop-feature-loyalty-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  LOYALTY_OVERVIEW_FEATURE,
  LOYALTY_SUMMARY_FEATURE,
  LOYALTY_DETAILS_FEATURE,
  LOYALTY_HISTORY_FEATURE,
  LOYALTY_SETTINGS_FEATURE,
  LOYALTY_EDITOR_FEATURE,
  LOYALTY_LIST_FEATURE,
  LOYALTY_WIZARD_FEATURE,
  LOYALTY_DASHBOARD_FEATURE,
  LOYALTY_INSIGHTS_FEATURE,
];

test.describe('Loyalty journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every loyalty feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every loyalty feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-loyalty');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first loyalty feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-loyalty')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
