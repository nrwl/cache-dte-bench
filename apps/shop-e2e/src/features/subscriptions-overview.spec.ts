import { expect, test } from '@playwright/test';
import {
  SUBSCRIPTIONS_OVERVIEW_FEATURE,
  SUBSCRIPTIONS_OVERVIEW_ITEM_COUNT,
} from '@org/shop-feature-subscriptions-overview';

test.describe('Subscriptions Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SUBSCRIPTIONS_OVERVIEW_FEATURE.route);
    await expect(
      page.getByTestId(SUBSCRIPTIONS_OVERVIEW_FEATURE.testId),
    ).toBeVisible();
  });

  test('renders the feature heading', async ({ page }) => {
    const heading = page
      .getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-header`)
      .getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(SUBSCRIPTIONS_OVERVIEW_FEATURE.title);
  });

  test('lists every item in the table', async ({ page }) => {
    const rows = page.getByTestId(
      `${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-row`,
    );
    await expect(rows).toHaveCount(SUBSCRIPTIONS_OVERVIEW_ITEM_COUNT);
  });

  test('selecting a row shows it in the detail panel', async ({ page }) => {
    const firstRow = page
      .getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-row`)
      .first();
    const name = await firstRow.locator('.feature-row-name').textContent();
    await firstRow.click();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveText(name ?? '');
    await page
      .getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-clear`)
      .click();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-panel-name`),
    ).toHaveCount(0);
  });

  test('filtering with no matches shows the empty state', async ({ page }) => {
    await page
      .getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-filter`)
      .fill('zzz-no-match');
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-empty`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`${SUBSCRIPTIONS_OVERVIEW_FEATURE.testId}-row`),
    ).toHaveCount(0);
  });
});
