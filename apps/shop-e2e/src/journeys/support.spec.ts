import { expect, test } from '@playwright/test';
import { SUPPORT_OVERVIEW_FEATURE } from '@org/shop-feature-support-overview';
import { SUPPORT_SUMMARY_FEATURE } from '@org/shop-feature-support-summary';
import { SUPPORT_DETAILS_FEATURE } from '@org/shop-feature-support-details';
import { SUPPORT_HISTORY_FEATURE } from '@org/shop-feature-support-history';
import { SUPPORT_SETTINGS_FEATURE } from '@org/shop-feature-support-settings';
import { SUPPORT_EDITOR_FEATURE } from '@org/shop-feature-support-editor';
import { SUPPORT_LIST_FEATURE } from '@org/shop-feature-support-list';
import { SUPPORT_WIZARD_FEATURE } from '@org/shop-feature-support-wizard';
import { SUPPORT_DASHBOARD_FEATURE } from '@org/shop-feature-support-dashboard';
import { SUPPORT_INSIGHTS_FEATURE } from '@org/shop-feature-support-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  SUPPORT_OVERVIEW_FEATURE,
  SUPPORT_SUMMARY_FEATURE,
  SUPPORT_DETAILS_FEATURE,
  SUPPORT_HISTORY_FEATURE,
  SUPPORT_SETTINGS_FEATURE,
  SUPPORT_EDITOR_FEATURE,
  SUPPORT_LIST_FEATURE,
  SUPPORT_WIZARD_FEATURE,
  SUPPORT_DASHBOARD_FEATURE,
  SUPPORT_INSIGHTS_FEATURE,
];

test.describe('Support journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every support feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every support feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-support');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first support feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-support')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
