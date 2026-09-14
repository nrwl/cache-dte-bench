import { test, expect } from '@playwright/test';
import { PRODUCTS_ROUTE } from '@org/shop-feature-products';

test.describe('Shop Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main header', async ({ page }) => {
    const header = page.locator('h1').first();
    await expect(header).toContainText('Nx Shop Demo');
  });

  test('should redirect to products page by default', async ({ page }) => {
    await page.waitForURL('**/products');
    expect(page.url()).toContain(PRODUCTS_ROUTE);

    const productsHeading = page.locator('h1:has-text("Our Products")');
    await expect(productsHeading).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/shop/i);
  });

  test('should display the tagline', async ({ page }) => {
    const tagline = page.locator('p:has-text("Explore our wide selection")');
    await expect(tagline).toBeVisible();
  });
});
