import { expect, test } from '@playwright/test';
import { ACCOUNT_OVERVIEW_FEATURE } from '@org/shop-feature-account-overview';
import { ACCOUNT_SUMMARY_FEATURE } from '@org/shop-feature-account-summary';
import { ACCOUNT_DETAILS_FEATURE } from '@org/shop-feature-account-details';
import { ACCOUNT_HISTORY_FEATURE } from '@org/shop-feature-account-history';
import { ACCOUNT_SETTINGS_FEATURE } from '@org/shop-feature-account-settings';
import { ACCOUNT_EDITOR_FEATURE } from '@org/shop-feature-account-editor';
import { ACCOUNT_LIST_FEATURE } from '@org/shop-feature-account-list';
import { ACCOUNT_WIZARD_FEATURE } from '@org/shop-feature-account-wizard';
import { ACCOUNT_DASHBOARD_FEATURE } from '@org/shop-feature-account-dashboard';
import { ACCOUNT_INSIGHTS_FEATURE } from '@org/shop-feature-account-insights';

const DOMAIN_FEATURES = [
  ACCOUNT_OVERVIEW_FEATURE,
  ACCOUNT_SUMMARY_FEATURE,
  ACCOUNT_DETAILS_FEATURE,
  ACCOUNT_HISTORY_FEATURE,
  ACCOUNT_SETTINGS_FEATURE,
  ACCOUNT_EDITOR_FEATURE,
  ACCOUNT_LIST_FEATURE,
  ACCOUNT_WIZARD_FEATURE,
  ACCOUNT_DASHBOARD_FEATURE,
  ACCOUNT_INSIGHTS_FEATURE,
];

test.describe('Account journey', () => {
  test('walks through every account feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every account feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-account');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first account feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-account')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
