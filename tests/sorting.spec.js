/**
 * 商品排序功能測試
 *
 * 測試商品列表的排序功能是否正常運作
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage } = require('../pages');

test.describe('商品排序功能測試', () => {
  let loginPage;
  let inventoryPage;

  // 每個測試前先登入
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('預設排序應為 Name (A to Z)', async ({ page }) => {
    // 取得排序下拉選單的當前值
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    const currentValue = await sortDropdown.inputValue();

    expect(currentValue).toBe('az');
  });

  test('選擇 Name (Z to A) 應反向排序', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');

    // 選擇 Z to A 排序
    await sortDropdown.selectOption('za');

    // 取得所有商品名稱
    const items = await page.locator('.inventory_item_name').allTextContents();

    // 驗證是否為反向排序（第一個應該是 Z 開頭）
    expect(items[0]).toContain('Test.allTheThings');
  });

  test('選擇 Price (low to high) 應由低到高排序', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');

    // 選擇價格低到高
    await sortDropdown.selectOption('lohi');

    // 取得所有價格
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const priceNumbers = prices.map(p => parseFloat(p.replace('$', '')));

    // 驗證價格是否遞增
    for (let i = 0; i < priceNumbers.length - 1; i++) {
      expect(priceNumbers[i]).toBeLessThanOrEqual(priceNumbers[i + 1]);
    }
  });

  test('選擇 Price (high to low) 應由高到低排序', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');

    // 選擇價格高到低
    await sortDropdown.selectOption('hilo');

    // 取得所有價格
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const priceNumbers = prices.map(p => parseFloat(p.replace('$', '')));

    // 驗證價格是否遞減
    for (let i = 0; i < priceNumbers.length - 1; i++) {
      expect(priceNumbers[i]).toBeGreaterThanOrEqual(priceNumbers[i + 1]);
    }
  });
});
