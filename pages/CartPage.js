/**
 * Cart Page Object (購物車頁面)
 *
 * 點擊購物車圖示後會看到的頁面
 */
class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 定義頁面元素
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButton = page.locator('button:has-text("Remove")');
  }

  /**
   * 取得購物車內商品數量
   * @returns {Promise<number>} 商品數量
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * 點擊結帳按鈕，前往結帳頁面
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * 點擊繼續購物，返回商品頁
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * 移除指定商品
   * @param {number} index - 商品索引 (從 0 開始)
   */
  async removeItem(index = 0) {
    await this.cartItems.nth(index).locator('button:has-text("Remove")').click();
  }
}

module.exports = { CartPage };
