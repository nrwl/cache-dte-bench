import { expect, test } from '@playwright/test';
import {
  PROFILE_LIST_FEATURE,
  PROFILE_LIST_ITEM_COUNT,
} from '@org/shop-feature-profile-list';

test.describe('Profile List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PROFILE_LIST_FEATURE.route);
    await expect(page.getByTestId(PROFILE_LIST_FEATURE.testId)).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${PROFILE_LIST_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(PROFILE_LIST_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(PROFILE_LIST_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${PROFILE_LIST_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${PROFILE_LIST_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${PROFILE_LIST_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
