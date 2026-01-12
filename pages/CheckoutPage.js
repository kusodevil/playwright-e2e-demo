/**
 * Checkout Page Object (結帳頁面)
 *
 * 結帳流程包含多個步驟：
 * 1. 填寫個人資訊 (checkout-step-one)
 * 2. 確認訂單摘要 (checkout-step-two)
 * 3. 完成訂單 (checkout-complete)
 */
class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Step 1: 個人資訊表單
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2: 訂單摘要
    this.summaryItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step 3: 完成頁面
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * 填寫個人資訊
   * @param {string} firstName - 名字
   * @param {string} lastName - 姓氏
   * @param {string} postalCode - 郵遞區號
   */
  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * 點擊繼續按鈕，前往下一步
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * 取得錯誤訊息
   * @returns {Promise<string>} 錯誤訊息
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * 取得訂單總金額
   * @returns {Promise<string>} 總金額文字
   */
  async getTotalPrice() {
    return await this.totalLabel.textContent();
  }

  /**
   * 點擊完成按鈕，完成訂單
   */
  async finish() {
    await this.finishButton.click();
  }

  /**
   * 取得完成訊息
   * @returns {Promise<string>} 完成訊息
   */
  async getCompleteMessage() {
    return await this.completeHeader.textContent();
  }

  /**
   * 點擊返回首頁按鈕
   */
  async backToHome() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutPage };
