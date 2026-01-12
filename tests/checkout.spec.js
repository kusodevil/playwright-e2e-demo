/**
 * 結帳功能測試
 *
 * 測試完整的購物流程：
 * 商品頁 → 加入購物車 → 購物車頁 → 結帳 → 完成
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('../pages');

// 測試資料
const TEST_USER = {
  username: 'standard_user',
  password: 'secret_sauce',
};

const CUSTOMER_INFO = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

test.describe('結帳功能測試', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  // 每個測試前：登入並加入商品到購物車
  test.beforeEach(async ({ page }) => {
    // 初始化所有 Page Objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // 登入
    await loginPage.goto();
    await loginPage.login(TEST_USER.username, TEST_USER.password);

    // 加入第一個商品到購物車
    await inventoryPage.addItemToCart(0);

    // 點擊購物車圖示進入購物車頁面
    await inventoryPage.cartLink.click();
  });

  test('完整結帳流程應成功完成訂單', async ({ page }) => {
    // Arrange - 確認購物車有商品
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);

    // Act - 執行結帳流程
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation(
      CUSTOMER_INFO.firstName,
      CUSTOMER_INFO.lastName,
      CUSTOMER_INFO.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finish();

    // Assert - 驗證訂單完成
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toBe('Thank you for your order!');
  });

  test('結帳時未填寫名字應顯示錯誤', async () => {
    // Act - 不填名字就按繼續
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('', 'Doe', '12345');
    await checkoutPage.continue();

    // Assert
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg).toContain('First Name is required');
  });

  test('結帳時未填寫姓氏應顯示錯誤', async () => {
    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('John', '', '12345');
    await checkoutPage.continue();

    // Assert
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg).toContain('Last Name is required');
  });

  test('結帳時未填寫郵遞區號應顯示錯誤', async () => {
    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('John', 'Doe', '');
    await checkoutPage.continue();

    // Assert
    const errorMsg = await checkoutPage.getErrorMessage();
    expect(errorMsg).toContain('Postal Code is required');
  });

  test('訂單摘要頁應顯示正確的商品數量', async ({ page }) => {
    // Act - 進入訂單摘要頁
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation(
      CUSTOMER_INFO.firstName,
      CUSTOMER_INFO.lastName,
      CUSTOMER_INFO.postalCode
    );
    await checkoutPage.continue();

    // Assert - 確認訂單摘要頁的商品數量
    const summaryItemCount = await checkoutPage.summaryItems.count();
    expect(summaryItemCount).toBe(1);

    // 確認有顯示總金額
    const totalPrice = await checkoutPage.getTotalPrice();
    expect(totalPrice).toContain('Total:');
  });
});
