/**
 * Login Page Object
 *
 * Page Object Model (POM) 是一種設計模式，將頁面的元素和操作封裝在類別中
 * 好處：
 * 1. 測試程式碼更乾淨、可讀性高
 * 2. 元素選擇器集中管理，維護方便
 * 3. 相同操作可重複使用
 */
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // 定義頁面元素的 locator
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * 前往登入頁面
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * 執行登入操作
   * @param {string} username - 使用者帳號
   * @param {string} password - 使用者密碼
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * 取得錯誤訊息文字
   * @returns {Promise<string>} 錯誤訊息
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };
