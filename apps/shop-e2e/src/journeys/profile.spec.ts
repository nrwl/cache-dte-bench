import { expect, test } from '@playwright/test';
import { PROFILE_OVERVIEW_FEATURE } from '@org/shop-feature-profile-overview';
import { PROFILE_SUMMARY_FEATURE } from '@org/shop-feature-profile-summary';
import { PROFILE_DETAILS_FEATURE } from '@org/shop-feature-profile-details';
import { PROFILE_HISTORY_FEATURE } from '@org/shop-feature-profile-history';
import { PROFILE_SETTINGS_FEATURE } from '@org/shop-feature-profile-settings';
import { PROFILE_EDITOR_FEATURE } from '@org/shop-feature-profile-editor';
import { PROFILE_LIST_FEATURE } from '@org/shop-feature-profile-list';
import { PROFILE_WIZARD_FEATURE } from '@org/shop-feature-profile-wizard';
import { PROFILE_DASHBOARD_FEATURE } from '@org/shop-feature-profile-dashboard';
import { PROFILE_INSIGHTS_FEATURE } from '@org/shop-feature-profile-insights';

const DOMAIN_FEATURES = [
  PROFILE_OVERVIEW_FEATURE,
  PROFILE_SUMMARY_FEATURE,
  PROFILE_DETAILS_FEATURE,
  PROFILE_HISTORY_FEATURE,
  PROFILE_SETTINGS_FEATURE,
  PROFILE_EDITOR_FEATURE,
  PROFILE_LIST_FEATURE,
  PROFILE_WIZARD_FEATURE,
  PROFILE_DASHBOARD_FEATURE,
  PROFILE_INSIGHTS_FEATURE,
];

test.describe('Profile journey', () => {
  test('walks through every profile feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every profile feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-profile');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first profile feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-profile')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
