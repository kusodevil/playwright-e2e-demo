// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * 環境設定
 * 透過 TEST_ENV 環境變數切換不同環境
 *
 * 使用方式：
 * - npm test                    (預設: production)
 * - npm run test:staging        (staging 環境)
 * - TEST_ENV=staging npm test   (手動指定)
 */
const environments = {
  production: {
    baseURL: 'https://www.saucedemo.com',
    name: 'Production',
  },
  staging: {
    baseURL: 'https://www.saucedemo.com', // Sauce Demo 只有一個環境，這裡示範用
    name: 'Staging',
  },
};

// 取得當前環境，預設為 production
const currentEnv = process.env.TEST_ENV || 'production';
const envConfig = environments[currentEnv] || environments.production;

console.log(`🌍 Testing Environment: ${envConfig.name} (${envConfig.baseURL})`);

/**
 * Playwright 設定檔
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // 測試檔案位置
  testDir: './tests',

  // 每個測試的最長執行時間
  timeout: 30 * 1000,

  // 斷言的最長等待時間
  expect: {
    timeout: 5000,
  },

  // 測試失敗時是否重試
  retries: process.env.CI ? 2 : 0,

  // 平行執行的 worker 數量
  workers: process.env.CI ? 1 : undefined,

  // 報告格式
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright'],
  ],

  // 所有測試共用的設定
  use: {
    // 基礎 URL，從環境設定中取得
    baseURL: envConfig.baseURL,

    // 截圖：只在失敗時截圖
    screenshot: 'only-on-failure',

    // 錄影：只在失敗時保留
    video: 'retain-on-failure',

    // 追蹤：只在第一次重試時記錄
    trace: 'on-first-retry',
  },

  // 瀏覽器設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
