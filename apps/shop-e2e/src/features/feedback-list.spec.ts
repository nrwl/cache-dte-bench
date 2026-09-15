import { expect, test } from '@playwright/test';
import {
  FEEDBACK_LIST_FEATURE,
  FEEDBACK_LIST_ITEM_COUNT,
} from '@org/shop-feature-feedback-list';
import { pace } from '../support/pacing';

test.describe('Feedback List', () => {
  test.beforeEach(async ({ page }) => {
    await pace();
    await page.goto(FEEDBACK_LIST_FEATURE.route);
    await expect(page.getByTestId(FEEDBACK_LIST_FEATURE.testId)).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(FEEDBACK_LIST_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-row`);
    await expect(rows).toHaveCount(FEEDBACK_LIST_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-clear`).click();
    await expect(
      page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${FEEDBACK_LIST_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
