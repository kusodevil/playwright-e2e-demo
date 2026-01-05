# Playwright E2E Testing Demo

使用 Playwright 進行 E2E 自動化測試的示範專案。

## 專案特色

- **Page Object Model (POM)** - 頁面元素與測試邏輯分離，易於維護
- **GitHub Actions CI/CD** - 自動化測試流程
- **測試報告** - HTML 格式的詳細測試報告

## 測試對象

[Sauce Demo](https://www.saucedemo.com) - 專門用於練習自動化測試的公開網站

## 專案結構

```
playwright-e2e-demo/
├── pages/                    # Page Objects
│   ├── LoginPage.js         # 登入頁面
│   ├── InventoryPage.js     # 商品列表頁
│   └── index.js             # 統一匯出
├── tests/                    # 測試檔案
│   ├── login.spec.js        # 登入功能測試
│   └── cart.spec.js         # 購物車功能測試
├── .github/workflows/        # CI/CD 設定
│   └── e2e-test.yml
├── playwright.config.js      # Playwright 設定
└── package.json
```

## 快速開始

```bash
# 安裝依賴
npm install

# 安裝瀏覽器
npx playwright install chromium

# 執行測試
npm test

# 執行測試（顯示瀏覽器）
npm run test:headed

# 開啟互動式 UI
npm run test:ui

# 查看測試報告
npm run report
```

## 測試案例

### 登入功能 (login.spec.js)
- 正確帳密應成功登入
- 被鎖定帳號應顯示錯誤訊息
- 錯誤帳密應顯示驗證失敗訊息
- 空白帳號/密碼應顯示必填提示

### 購物車功能 (cart.spec.js)
- 商品頁應顯示正確數量
- 加入商品後購物車數量應更新

## CI/CD

每次推送到 `main` 分支或發起 PR 時，GitHub Actions 會自動：
1. 安裝依賴
2. 執行所有測試
3. 產生測試報告

## 技術棧

- [Playwright](https://playwright.dev/) - E2E 測試框架
- [Node.js](https://nodejs.org/) - JavaScript 執行環境
- [GitHub Actions](https://github.com/features/actions) - CI/CD
