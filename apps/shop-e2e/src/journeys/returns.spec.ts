import { expect, test } from '@playwright/test';
import { RETURNS_OVERVIEW_FEATURE } from '@org/shop-feature-returns-overview';
import { RETURNS_SUMMARY_FEATURE } from '@org/shop-feature-returns-summary';
import { RETURNS_DETAILS_FEATURE } from '@org/shop-feature-returns-details';
import { RETURNS_HISTORY_FEATURE } from '@org/shop-feature-returns-history';
import { RETURNS_SETTINGS_FEATURE } from '@org/shop-feature-returns-settings';
import { RETURNS_EDITOR_FEATURE } from '@org/shop-feature-returns-editor';
import { RETURNS_LIST_FEATURE } from '@org/shop-feature-returns-list';
import { RETURNS_WIZARD_FEATURE } from '@org/shop-feature-returns-wizard';
import { RETURNS_DASHBOARD_FEATURE } from '@org/shop-feature-returns-dashboard';
import { RETURNS_INSIGHTS_FEATURE } from '@org/shop-feature-returns-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  RETURNS_OVERVIEW_FEATURE,
  RETURNS_SUMMARY_FEATURE,
  RETURNS_DETAILS_FEATURE,
  RETURNS_HISTORY_FEATURE,
  RETURNS_SETTINGS_FEATURE,
  RETURNS_EDITOR_FEATURE,
  RETURNS_LIST_FEATURE,
  RETURNS_WIZARD_FEATURE,
  RETURNS_DASHBOARD_FEATURE,
  RETURNS_INSIGHTS_FEATURE,
];

test.describe('Returns journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every returns feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every returns feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-returns');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first returns feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-returns')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
