import { expect, test } from '@playwright/test';
import {
  ACCOUNT_SUMMARY_FEATURE,
  ACCOUNT_SUMMARY_ITEM_COUNT,
} from '@org/shop-feature-account-summary';
import { pace } from '../support/pacing';

test.describe('Account Summary', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(ACCOUNT_SUMMARY_FEATURE.route);
    await expect(
      page.getByTestId(ACCOUNT_SUMMARY_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(ACCOUNT_SUMMARY_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(ACCOUNT_SUMMARY_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${ACCOUNT_SUMMARY_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
