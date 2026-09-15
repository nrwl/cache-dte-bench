import { expect, test } from '@playwright/test';
import { GIFT_CARDS_OVERVIEW_FEATURE } from '@org/shop-feature-gift-cards-overview';
import { GIFT_CARDS_SUMMARY_FEATURE } from '@org/shop-feature-gift-cards-summary';
import { GIFT_CARDS_DETAILS_FEATURE } from '@org/shop-feature-gift-cards-details';
import { GIFT_CARDS_HISTORY_FEATURE } from '@org/shop-feature-gift-cards-history';
import { GIFT_CARDS_SETTINGS_FEATURE } from '@org/shop-feature-gift-cards-settings';
import { GIFT_CARDS_EDITOR_FEATURE } from '@org/shop-feature-gift-cards-editor';
import { GIFT_CARDS_LIST_FEATURE } from '@org/shop-feature-gift-cards-list';
import { GIFT_CARDS_WIZARD_FEATURE } from '@org/shop-feature-gift-cards-wizard';
import { GIFT_CARDS_DASHBOARD_FEATURE } from '@org/shop-feature-gift-cards-dashboard';
import { GIFT_CARDS_INSIGHTS_FEATURE } from '@org/shop-feature-gift-cards-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  GIFT_CARDS_OVERVIEW_FEATURE,
  GIFT_CARDS_SUMMARY_FEATURE,
  GIFT_CARDS_DETAILS_FEATURE,
  GIFT_CARDS_HISTORY_FEATURE,
  GIFT_CARDS_SETTINGS_FEATURE,
  GIFT_CARDS_EDITOR_FEATURE,
  GIFT_CARDS_LIST_FEATURE,
  GIFT_CARDS_WIZARD_FEATURE,
  GIFT_CARDS_DASHBOARD_FEATURE,
  GIFT_CARDS_INSIGHTS_FEATURE,
];

test.describe('Gift Cards journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every gift-cards feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every gift-cards feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-gift-cards');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first gift-cards feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-gift-cards')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
