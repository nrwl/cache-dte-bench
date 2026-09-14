import { expect, test } from '@playwright/test';
import { COMPARE_OVERVIEW_FEATURE } from '@org/shop-feature-compare-overview';
import { COMPARE_SUMMARY_FEATURE } from '@org/shop-feature-compare-summary';
import { COMPARE_DETAILS_FEATURE } from '@org/shop-feature-compare-details';
import { COMPARE_HISTORY_FEATURE } from '@org/shop-feature-compare-history';
import { COMPARE_SETTINGS_FEATURE } from '@org/shop-feature-compare-settings';
import { COMPARE_EDITOR_FEATURE } from '@org/shop-feature-compare-editor';
import { COMPARE_LIST_FEATURE } from '@org/shop-feature-compare-list';
import { COMPARE_WIZARD_FEATURE } from '@org/shop-feature-compare-wizard';
import { COMPARE_DASHBOARD_FEATURE } from '@org/shop-feature-compare-dashboard';
import { COMPARE_INSIGHTS_FEATURE } from '@org/shop-feature-compare-insights';

const DOMAIN_FEATURES = [
  COMPARE_OVERVIEW_FEATURE,
  COMPARE_SUMMARY_FEATURE,
  COMPARE_DETAILS_FEATURE,
  COMPARE_HISTORY_FEATURE,
  COMPARE_SETTINGS_FEATURE,
  COMPARE_EDITOR_FEATURE,
  COMPARE_LIST_FEATURE,
  COMPARE_WIZARD_FEATURE,
  COMPARE_DASHBOARD_FEATURE,
  COMPARE_INSIGHTS_FEATURE,
];

test.describe('Compare journey', () => {
  test('walks through every compare feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every compare feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-compare');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first compare feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-compare')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
