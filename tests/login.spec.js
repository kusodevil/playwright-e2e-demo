/**
 * 登入功能測試
 *
 * 測試對象：Sauce Demo (https://www.saucedemo.com)
 * 這是一個專門用於練習自動化測試的公開網站
 *
 * 可用帳號：
 * - standard_user / secret_sauce (正常用戶)
 * - locked_out_user / secret_sauce (被鎖定的用戶)
 * - problem_user / secret_sauce (會遇到問題的用戶)
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage } = require('../pages');

// 測試資料
const TEST_USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

test.describe('登入功能測試', () => {
  let loginPage;
  let inventoryPage;

  // 每個測試執行前都會先執行這段
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('正確帳密應成功登入並看到商品頁', async ({ page }) => {
    // Arrange - 準備測試資料
    const { username, password } = TEST_USERS.standard;

    // Act - 執行登入
    await loginPage.login(username, password);

    // Assert - 驗證結果
    await expect(page).toHaveURL(/inventory/);
    const title = await inventoryPage.getTitle();
    expect(title).toBe('Products');
  });

  test('被鎖定帳號應顯示錯誤訊息', async () => {
    // Arrange
    const { username, password } = TEST_USERS.locked;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('locked out');
  });

  test('錯誤帳密應顯示驗證失敗訊息', async () => {
    // Arrange
    const { username, password } = TEST_USERS.invalid;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username and password do not match');
  });

  test('空白帳號應顯示必填提示', async () => {
    // Act - 只輸入密碼，不輸入帳號
    await loginPage.login('', 'secret_sauce');

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username is required');
  });

  test('空白密碼應顯示必填提示', async () => {
    // Act - 只輸入帳號，不輸入密碼
    await loginPage.login('standard_user', '');

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Password is required');
  });
});
