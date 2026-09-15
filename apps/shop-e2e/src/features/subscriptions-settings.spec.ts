import { expect, test } from '@playwright/test';
import {
  SUBSCRIPTIONS_SETTINGS_FEATURE,
  SUBSCRIPTIONS_SETTINGS_ITEM_COUNT,
} from '@org/shop-feature-subscriptions-settings';
import { pace } from '../support/pacing';

test.describe('Subscriptions Settings', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(SUBSCRIPTIONS_SETTINGS_FEATURE.route);
    await expect(
      page.getByTestId(SUBSCRIPTIONS_SETTINGS_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(SUBSCRIPTIONS_SETTINGS_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(
      `${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-row`,
    );
    await expect(rows).toHaveCount(SUBSCRIPTIONS_SETTINGS_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page
      .getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-clear`)
      .click();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_SETTINGS_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
