import { expect, test } from '@playwright/test';
import { AUTH_OVERVIEW_FEATURE } from '@org/shop-feature-auth-overview';
import { AUTH_SUMMARY_FEATURE } from '@org/shop-feature-auth-summary';
import { AUTH_DETAILS_FEATURE } from '@org/shop-feature-auth-details';
import { AUTH_HISTORY_FEATURE } from '@org/shop-feature-auth-history';
import { AUTH_SETTINGS_FEATURE } from '@org/shop-feature-auth-settings';
import { AUTH_EDITOR_FEATURE } from '@org/shop-feature-auth-editor';
import { AUTH_LIST_FEATURE } from '@org/shop-feature-auth-list';
import { AUTH_WIZARD_FEATURE } from '@org/shop-feature-auth-wizard';
import { AUTH_DASHBOARD_FEATURE } from '@org/shop-feature-auth-dashboard';
import { AUTH_INSIGHTS_FEATURE } from '@org/shop-feature-auth-insights';

const DOMAIN_FEATURES = [
  AUTH_OVERVIEW_FEATURE,
  AUTH_SUMMARY_FEATURE,
  AUTH_DETAILS_FEATURE,
  AUTH_HISTORY_FEATURE,
  AUTH_SETTINGS_FEATURE,
  AUTH_EDITOR_FEATURE,
  AUTH_LIST_FEATURE,
  AUTH_WIZARD_FEATURE,
  AUTH_DASHBOARD_FEATURE,
  AUTH_INSIGHTS_FEATURE,
];

test.describe('Auth journey', () => {
  test('walks through every auth feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every auth feature on the features index', async ({ page }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-auth');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first auth feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-auth')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
