import { expect, test } from '@playwright/test';
import { INVENTORY_OVERVIEW_FEATURE } from '@org/shop-feature-inventory-overview';
import { INVENTORY_SUMMARY_FEATURE } from '@org/shop-feature-inventory-summary';
import { INVENTORY_DETAILS_FEATURE } from '@org/shop-feature-inventory-details';
import { INVENTORY_HISTORY_FEATURE } from '@org/shop-feature-inventory-history';
import { INVENTORY_SETTINGS_FEATURE } from '@org/shop-feature-inventory-settings';
import { INVENTORY_EDITOR_FEATURE } from '@org/shop-feature-inventory-editor';
import { INVENTORY_LIST_FEATURE } from '@org/shop-feature-inventory-list';
import { INVENTORY_WIZARD_FEATURE } from '@org/shop-feature-inventory-wizard';
import { INVENTORY_DASHBOARD_FEATURE } from '@org/shop-feature-inventory-dashboard';
import { INVENTORY_INSIGHTS_FEATURE } from '@org/shop-feature-inventory-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  INVENTORY_OVERVIEW_FEATURE,
  INVENTORY_SUMMARY_FEATURE,
  INVENTORY_DETAILS_FEATURE,
  INVENTORY_HISTORY_FEATURE,
  INVENTORY_SETTINGS_FEATURE,
  INVENTORY_EDITOR_FEATURE,
  INVENTORY_LIST_FEATURE,
  INVENTORY_WIZARD_FEATURE,
  INVENTORY_DASHBOARD_FEATURE,
  INVENTORY_INSIGHTS_FEATURE,
];

test.describe('Inventory journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every inventory feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every inventory feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-inventory');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first inventory feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-inventory')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
