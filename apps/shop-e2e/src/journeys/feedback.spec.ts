import { expect, test } from '@playwright/test';
import { FEEDBACK_OVERVIEW_FEATURE } from '@org/shop-feature-feedback-overview';
import { FEEDBACK_SUMMARY_FEATURE } from '@org/shop-feature-feedback-summary';
import { FEEDBACK_DETAILS_FEATURE } from '@org/shop-feature-feedback-details';
import { FEEDBACK_HISTORY_FEATURE } from '@org/shop-feature-feedback-history';
import { FEEDBACK_SETTINGS_FEATURE } from '@org/shop-feature-feedback-settings';
import { FEEDBACK_EDITOR_FEATURE } from '@org/shop-feature-feedback-editor';
import { FEEDBACK_LIST_FEATURE } from '@org/shop-feature-feedback-list';
import { FEEDBACK_WIZARD_FEATURE } from '@org/shop-feature-feedback-wizard';
import { FEEDBACK_DASHBOARD_FEATURE } from '@org/shop-feature-feedback-dashboard';
import { FEEDBACK_INSIGHTS_FEATURE } from '@org/shop-feature-feedback-insights';
import { pace } from '../support/pacing';

const DOMAIN_FEATURES = [
  FEEDBACK_OVERVIEW_FEATURE,
  FEEDBACK_SUMMARY_FEATURE,
  FEEDBACK_DETAILS_FEATURE,
  FEEDBACK_HISTORY_FEATURE,
  FEEDBACK_SETTINGS_FEATURE,
  FEEDBACK_EDITOR_FEATURE,
  FEEDBACK_LIST_FEATURE,
  FEEDBACK_WIZARD_FEATURE,
  FEEDBACK_DASHBOARD_FEATURE,
  FEEDBACK_INSIGHTS_FEATURE,
];

test.describe('Feedback journey', () => {
  test.beforeEach(async () => {
    await pace();
  });

  test('walks through every feedback feature', async ({ page }) => {
    for (const feature of DOMAIN_FEATURES) {
      await page.goto(feature.route);
      await expect(page.getByTestId(feature.testId)).toBeVisible();
      await expect(page.getByTestId(`${feature.testId}-row`)).toHaveCount(
        feature.itemCount,
      );
    }
  });

  test('lists every feedback feature on the features index', async ({
    page,
  }) => {
    await page.goto('/features');
    const group = page.getByTestId('feature-index-feedback');
    await expect(group).toBeVisible();
    for (const feature of DOMAIN_FEATURES) {
      await expect(
        group.getByRole('link', { name: feature.title }),
      ).toBeVisible();
    }
  });

  test('navigates from the index into the first feedback feature', async ({
    page,
  }) => {
    await page.goto('/features');
    const [first] = DOMAIN_FEATURES;
    await page
      .getByTestId('feature-index-feedback')
      .getByRole('link', { name: first.title })
      .click();
    await page.waitForURL(`**${first.route}`);
    await expect(page.getByTestId(first.testId)).toBeVisible();
  });
});
