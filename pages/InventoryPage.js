/**
 * Inventory Page Object (商品列表頁)
 *
 * 登入成功後會看到的商品頁面
 */
class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 定義頁面元素
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /**
   * 取得頁面標題
   * @returns {Promise<string>} 頁面標題
   */
  async getTitle() {
    return await this.title.textContent();
  }

  /**
   * 取得商品數量
   * @returns {Promise<number>} 商品數量
   */
  async getItemCount() {
    return await this.inventoryItems.count();
  }

  /**
   * 將指定商品加入購物車
   * @param {number} index - 商品索引 (從 0 開始)
   */
  async addItemToCart(index = 0) {
    const addButton = this.inventoryItems
      .nth(index)
      .locator('button:has-text("Add to cart")');
    await addButton.click();
  }

  /**
   * 取得購物車商品數量
   * @returns {Promise<number>} 購物車商品數量
   */
  async getCartCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * 執行登出
   */
  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}

module.exports = { InventoryPage };
