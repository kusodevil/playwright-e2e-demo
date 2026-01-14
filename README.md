# Playwright E2E Testing Demo

E2E 測試示範專案，使用 Playwright 搭配 Page Object Model 架構。

## 專案特色

- ✅ **Page Object Model** - 頁面元素與測試邏輯分離
- ✅ **13 個測試案例** - 登入、購物車、完整結帳流程
- ✅ **多環境支援** - 透過環境變數切換測試環境
- ✅ **CI/CD** - GitHub Actions 自動執行測試
- ✅ **Allure 報告** - 視覺化測試報告
- ✅ **Slack 通知** - 測試完成自動通知
- ✅ **Docker 支援** - 容器化測試環境

## 測試對象

**Sauce Demo** - https://www.saucedemo.com

測試帳號：`standard_user` / 密碼：`secret_sauce`

## 快速開始

### 本地執行

```bash
# 安裝依賴
npm install

# 執行所有測試
npm test

# 執行特定環境測試
npm run test:staging

# 查看測試報告
npm run report
```

### 使用 Docker

#### 方式 1：使用 docker-compose（推薦）

```bash
# 執行測試（production 環境）
docker-compose up

# 執行測試並查看 log
docker-compose up --abort-on-container-exit

# 執行 staging 環境測試
docker-compose --profile staging up e2e-tests-staging

# 清理容器
docker-compose down
```

#### 方式 2：直接使用 Docker

```bash
# 建立 image
docker build -t playwright-e2e-demo .

# 執行測試
docker run --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/allure-results:/app/allure-results \
  playwright-e2e-demo

# 執行測試（staging 環境）
docker run --rm \
  -e TEST_ENV=staging \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-e2e-demo npm run test:staging
```

## 專案結構

```
playwright-e2e-demo/
├── pages/                    # Page Object Model
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── index.js
├── tests/                    # 測試檔案
│   ├── login.spec.js        # 登入測試 (5 個)
│   ├── cart.spec.js         # 購物車測試 (3 個)
│   └── checkout.spec.js     # 結帳測試 (5 個)
├── .github/
│   └── workflows/
│       └── e2e-test.yml     # GitHub Actions CI/CD
├── Dockerfile               # Docker 設定
├── docker-compose.yml       # Docker Compose 設定
├── playwright.config.js     # Playwright 設定
└── package.json
```

## 測試案例

### 登入功能 (5 個測試)
- 正確帳密應成功登入
- 被鎖定帳號應顯示錯誤
- 錯誤帳密應顯示錯誤
- 空白帳號應顯示錯誤
- 空白密碼應顯示錯誤

### 購物車功能 (3 個測試)
- 商品頁應顯示 6 個商品
- 加入一個商品後購物車應顯示 1
- 加入多個商品後購物車數量應正確

### 結帳功能 (5 個測試)
- 完整結帳流程應成功完成訂單
- 結帳時未填寫名字應顯示錯誤
- 結帳時未填寫姓氏應顯示錯誤
- 結帳時未填寫郵遞區號應顯示錯誤
- 訂單摘要頁應顯示正確的商品數量

## Docker 優勢

### 為什麼使用 Docker？

1. **環境一致性** - 本地、CI、生產環境完全相同
2. **快速部署** - 一個指令啟動測試環境
3. **無需本地安裝** - 不用安裝 Node.js、瀏覽器等依賴
4. **易於擴展** - 可輕鬆在多台機器平行執行測試
5. **版本控制** - Dockerfile 記錄所有環境配置

### Docker 架構說明

```
┌─────────────────────────────────────┐
│   Playwright Official Image         │
│   (包含 Chromium, Firefox, WebKit)  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   安裝 npm dependencies             │
│   (Playwright, Allure, etc.)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   複製專案檔案                       │
│   (tests, pages, config)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   執行測試                           │
│   npm test                          │
└─────────────────────────────────────┘
```

## CI/CD

每次 push 到 `main` 分支會自動：
1. 使用 Docker 執行所有測試（支援 layer cache 加速）
2. 產生 Allure 報告
3. 部署報告到 GitHub Pages
4. 發送 Slack 通知

**測試報告**: https://kusodevil.github.io/playwright-e2e-demo/

### CI/CD 優化

專案使用 **Docker Layer Caching** 來加速 CI 建置：
- 第一次執行：完整建立所有 layer（約 2-3 分鐘）
- 後續執行：僅重建有變更的 layer（約 30-60 秒）
- Cache 儲存在 GitHub Actions Cache 中
- 使用 `cache-from: type=gha` 和 `cache-to: type=gha,mode=max`

## 技術堆疊

- **測試框架**: Playwright v1.57.0
- **報告工具**: Allure, HTML Report
- **CI/CD**: GitHub Actions
- **容器化**: Docker, Docker Compose
- **通知**: Slack Webhook

## 面試重點

### Page Object Model
> 將頁面元素和操作封裝成 class，測試程式碼更簡潔且易於維護。當 UI 改變時，只需修改對應的 Page Object。

### 多環境切換
> 透過環境變數 `TEST_ENV` 切換不同環境的 baseURL，支援 production、staging 等多環境測試。

### Docker 容器化
> 使用 Docker 確保測試環境一致性，避免「在我電腦上可以跑」的問題。CI/CD 和本地使用相同的 Docker image。

### CI/CD 自動化
> GitHub Actions 自動執行測試、產生報告、部署到 GitHub Pages，並發送 Slack 通知。測試失敗會自動重試 2 次。

### Docker Layer Caching
> 透過 GitHub Actions Cache 儲存 Docker layer，讓 CI 建置時間從 2-3 分鐘縮短到 30-60 秒。只有變更的 layer 會重新建立，大幅提升 CI 效率。

## 作者

**Jay Huang** - QA/SDET 作品集專案

## License

MIT
