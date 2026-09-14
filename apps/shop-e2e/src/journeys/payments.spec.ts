import { expect, test } from '@playwright/test';
import { PAYMENTS_OVERVIEW_FEATURE } from '@org/shop-feature-payments-overview';
import { PAYMENTS_SUMMARY_FEATURE } from '@org/shop-feature-payments-summary';
import { PAYMENTS_DETAILS_FEATURE } from '@org/shop-feature-payments-details';
import { PAYMENTS_HISTORY_FEATURE } from '@org/shop-feature-payments-history';
import { PAYMENTS_SETTINGS_FEATURE } from '@org/shop-feature-payments-settings';
import { PAYMENTS_EDITOR_FEATURE } from '@org/shop-feature-payments-editor';
import { PAYMENTS_LIST_FEATURE } from '@org/shop-feature-payments-list';
import { PAYMENTS_WIZARD_FEATURE } from '@org/shop-feature-payments-wizard';
import { PAYMENTS_DASHBOARD_FEATURE } from '@org/shop-feature-payments-dashboard';
import { PAYMENTS_INSIGHTS_FEATURE } from '@org/shop-feature-payments-insights';

const DOMAIN_FEATURES = [
  PAYMENTS_OVERVIEW_FEATURE,
  PAYMENTS_SUMMARY_FEATURE,
  PAYMENTS_DETAILS_FEATURE,
  PAYMENTS_HISTORY_FEATURE,
  PAYMENTS_SETTINGS_FEATURE,
  PAYMENTS_EDITOR_FEATURE,
  PAYMENTS_LIST_FEATURE,
  PAYMENTS_WIZARD_FEATURE,
  PAYMENTS_DASHBOARD_FEATURE,
  PAYMENTS_INSIGHTS_FEATURE,
];

test.describe('Payments journey', () => {
  test('walks through every payments feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every payments feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-payments');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first payments feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-payments')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
