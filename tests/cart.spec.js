/**
 * 購物車功能測試
 *
 * 測試商品加入購物車的功能
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage } = require('../pages');

test.describe('購物車功能測試', () => {
  let loginPage;
  let inventoryPage;

  // 每個測試前先登入
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // 確認已登入成功
    await expect(page).toHaveURL(/inventory/);
  });

  test('商品頁應顯示 6 個商品', async () => {
    const itemCount = await inventoryPage.getItemCount();
    expect(itemCount).toBe(6);
  });

  test('加入一個商品後購物車應顯示 1', async () => {
    // 初始購物車應為空
    const initialCount = await inventoryPage.getCartCount();
    expect(initialCount).toBe(0);

    // 加入第一個商品
    await inventoryPage.addItemToCart(0);

    // 購物車應顯示 1
    const newCount = await inventoryPage.getCartCount();
    expect(newCount).toBe(1);
  });

  test('加入多個商品後購物車數量應正確', async () => {
    // 加入前兩個商品
    await inventoryPage.addItemToCart(0);
    await inventoryPage.addItemToCart(1);

    // 購物車應顯示 2
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(2);
  });
});
