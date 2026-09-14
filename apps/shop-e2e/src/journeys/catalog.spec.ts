import { expect, test } from '@playwright/test';
import { CATALOG_OVERVIEW_FEATURE } from '@org/shop-feature-catalog-overview';
import { CATALOG_SUMMARY_FEATURE } from '@org/shop-feature-catalog-summary';
import { CATALOG_DETAILS_FEATURE } from '@org/shop-feature-catalog-details';
import { CATALOG_HISTORY_FEATURE } from '@org/shop-feature-catalog-history';
import { CATALOG_SETTINGS_FEATURE } from '@org/shop-feature-catalog-settings';
import { CATALOG_EDITOR_FEATURE } from '@org/shop-feature-catalog-editor';
import { CATALOG_LIST_FEATURE } from '@org/shop-feature-catalog-list';
import { CATALOG_WIZARD_FEATURE } from '@org/shop-feature-catalog-wizard';
import { CATALOG_DASHBOARD_FEATURE } from '@org/shop-feature-catalog-dashboard';
import { CATALOG_INSIGHTS_FEATURE } from '@org/shop-feature-catalog-insights';

const DOMAIN_FEATURES = [
  CATALOG_OVERVIEW_FEATURE,
  CATALOG_SUMMARY_FEATURE,
  CATALOG_DETAILS_FEATURE,
  CATALOG_HISTORY_FEATURE,
  CATALOG_SETTINGS_FEATURE,
  CATALOG_EDITOR_FEATURE,
  CATALOG_LIST_FEATURE,
  CATALOG_WIZARD_FEATURE,
  CATALOG_DASHBOARD_FEATURE,
  CATALOG_INSIGHTS_FEATURE,
];

test.describe('Catalog journey', () => {
  test('walks through every catalog feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every catalog feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-catalog');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first catalog feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-catalog')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
