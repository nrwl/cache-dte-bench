import { expect, test } from '@playwright/test';
import { PREORDERS_OVERVIEW_FEATURE } from '@org/shop-feature-preorders-overview';
import { PREORDERS_SUMMARY_FEATURE } from '@org/shop-feature-preorders-summary';
import { PREORDERS_DETAILS_FEATURE } from '@org/shop-feature-preorders-details';
import { PREORDERS_HISTORY_FEATURE } from '@org/shop-feature-preorders-history';
import { PREORDERS_SETTINGS_FEATURE } from '@org/shop-feature-preorders-settings';
import { PREORDERS_EDITOR_FEATURE } from '@org/shop-feature-preorders-editor';
import { PREORDERS_LIST_FEATURE } from '@org/shop-feature-preorders-list';
import { PREORDERS_WIZARD_FEATURE } from '@org/shop-feature-preorders-wizard';
import { PREORDERS_DASHBOARD_FEATURE } from '@org/shop-feature-preorders-dashboard';
import { PREORDERS_INSIGHTS_FEATURE } from '@org/shop-feature-preorders-insights';

const DOMAIN_FEATURES = [
  PREORDERS_OVERVIEW_FEATURE,
  PREORDERS_SUMMARY_FEATURE,
  PREORDERS_DETAILS_FEATURE,
  PREORDERS_HISTORY_FEATURE,
  PREORDERS_SETTINGS_FEATURE,
  PREORDERS_EDITOR_FEATURE,
  PREORDERS_LIST_FEATURE,
  PREORDERS_WIZARD_FEATURE,
  PREORDERS_DASHBOARD_FEATURE,
  PREORDERS_INSIGHTS_FEATURE,
];

test.describe('Preorders journey', () => {
  test('walks through every preorders feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every preorders feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-preorders');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first preorders feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-preorders')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
