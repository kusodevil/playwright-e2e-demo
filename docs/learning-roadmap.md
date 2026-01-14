# SDET 學習 Roadmap - Jay 的技能提升計畫

> 從手動 QA 到 SDET 的完整學習計畫
>
> 目標：深入理解現有專案 → 提升技術能力 → 獨立開發測試框架 → 為未來職涯發展做準備

---

## 📋 目錄

1. [學習目標](#學習目標)
2. [階段一：深入理解 E2E 測試專案](#階段一深入理解-e2e-測試專案)
3. [階段二：深入理解 API 測試專案](#階段二深入理解-api-測試專案)
4. [階段三：實戰練習](#階段三實戰練習)
5. [階段四：技術深化與總結](#階段四技術深化與總結)
6. [常見問題 FAQ](#常見問題-faq)
7. [學習檢核表](#學習檢核表)

---

## 學習目標

### 最終目標
- ✅ 每個專案掌握度達到 90%
- ✅ 能完整講解技術選型和設計決策
- ✅ 能獨立新增測試案例並優化現有測試
- ✅ 能獨立 debug 和解決問題
- ✅ 技術討論時能自信說明架構設計

### 時間規劃
- **階段一**: 1 週（E2E 專案深入理解）
- **階段二**: 1 週（API 專案深入理解）
- **階段三**: 1 週（實戰練習與優化）
- **階段四**: 3-5 天（技術深化與知識整合）
- **總計**: 約 3-4 週

---

## 階段一：深入理解 E2E 測試專案

### Day 1-2: 專案架構與設計模式

#### 1.1 Page Object Model (POM)

**必須理解的問題：**

- [ ] **什麼是 Page Object Model？**
  - 答案關鍵字：封裝、分離、維護性
  - 完整答案：將頁面元素和操作封裝成 class，讓測試程式碼和頁面邏輯分離，提高程式碼重用性和維護性

- [ ] **為什麼要用 POM？**
  - 答案關鍵字：UI 變更、一處修改、降低維護成本
  - 完整答案：當 UI 改變時，只需修改對應的 Page Object，不用改所有測試。例如登入按鈕 ID 改了，只改 LoginPage.js 一個地方

- [ ] **POM 的優點？**
  1. 程式碼重用（多個測試共用同一個 Page Object）
  2. 易於維護（UI 改變只改一處）
  3. 測試程式碼更清晰（test 只關注邏輯，不管細節）
  4. 降低重複程式碼

- [ ] **POM 的缺點？**
  1. 初期開發較慢（要先建立 Page Object）
  2. 小專案可能過度設計
  3. 需要維護額外的 class

- [ ] **什麼時候不該用 POM？**
  - 非常簡單的測試（只有 1-2 個測試）
  - 原型驗證（POC）
  - 頁面變動非常頻繁且不穩定

**實作理解：**

```javascript
// pages/LoginPage.js - 仔細閱讀每一行

class LoginPage {
  // Q: constructor 是什麼？
  // A: 建構子，建立 instance 時會執行
  constructor(page) {
    // Q: this.page 是什麼？
    // A: Playwright 的 page 物件，代表瀏覽器頁面
    this.page = page;

    // Q: 為什麼要用 [data-test="..."]？
    // A: 因為是專門給測試用的屬性，不會因為 CSS 改變而失效
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Q: async 是什麼？
  // A: 表示這是非同步函式，裡面會有 await
  async navigate() {
    // Q: 為什麼要用 await？
    // A: 因為 goto 是非同步操作，需要等待完成
    await this.page.goto('/');
  }

  // Q: 為什麼要封裝成 login() 方法？
  // A: 讓測試程式碼更簡潔，隱藏實作細節
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = LoginPage;
```

**動手練習：**
1. 打開 `pages/LoginPage.js`，逐行加上中文註解
2. 嘗試在 LoginPage 加一個新方法：`async isLoginButtonEnabled()`
3. 故意改壞一個 selector，執行測試，觀察錯誤訊息

#### 1.2 JavaScript 核心觀念

**必須理解的問題：**

- [ ] **什麼是 async/await？**
  ```javascript
  // 同步（Synchronous）- 一行一行執行
  console.log('1');
  console.log('2');
  console.log('3');
  // 輸出：1, 2, 3

  // 非同步（Asynchronous）- 不會等待
  console.log('1');
  setTimeout(() => console.log('2'), 1000);
  console.log('3');
  // 輸出：1, 3, 2（2 會延遲 1 秒）

  // async/await - 讓非同步看起來像同步
  async function example() {
    console.log('1');
    await delay(1000); // 等待 1 秒
    console.log('2');
    console.log('3');
  }
  // 輸出：1, 2, 3（依序執行）
  ```

- [ ] **為什麼 Playwright 要用 async/await？**
  - 瀏覽器操作需要時間（點擊、輸入、等待元素）
  - 如果不等待會出錯（元素還沒出現就點擊）
  - async/await 讓程式碼易讀

- [ ] **什麼是 class？**
  ```javascript
  // class 是物件的藍圖
  class Car {
    constructor(brand) {
      this.brand = brand; // 屬性
    }

    drive() { // 方法
      console.log(`${this.brand} is driving`);
    }
  }

  // 建立 instance（實體）
  const myCar = new Car('Toyota');
  myCar.drive(); // Toyota is driving
  ```

- [ ] **什麼是 this？**
  ```javascript
  class LoginPage {
    constructor(page) {
      this.page = page; // this 指向當前的 instance
    }

    async login() {
      await this.page.goto('/'); // 使用 this 存取 page
    }
  }
  ```

**動手練習：**
1. 在 Node.js console 中練習 async/await
2. 寫一個簡單的 class（例如 Calculator）
3. 解釋給非技術人員聽：「為什麼要用 async/await？」

#### 1.3 Playwright 核心觀念

**必須理解的問題：**

- [ ] **Playwright 的 auto-wait 是什麼？**
  ```javascript
  // Selenium（舊的做法）
  driver.findElement(By.id('button')).click(); // 可能失敗（元素還沒出現）

  // 需要手動等待
  WebDriverWait wait = new WebDriverWait(driver, 10);
  wait.until(ExpectedConditions.elementToBeClickable(By.id('button')));
  driver.findElement(By.id('button')).click();

  // Playwright（自動等待）
  await page.locator('#button').click(); // 自動等待元素出現且可點擊
  ```

- [ ] **Playwright 比 Selenium 好在哪？**
  1. **自動等待** - 不用寫 explicit wait
  2. **更快** - 直接控制瀏覽器，不透過 WebDriver
  3. **更穩定** - 少 flaky tests
  4. **支援多瀏覽器** - Chromium, Firefox, WebKit
  5. **現代化 API** - async/await, Promise-based

- [ ] **什麼是 locator？**
  ```javascript
  // locator 是「找元素的方式」，還沒真的去找
  const button = page.locator('#login-button');

  // 真正執行操作時才會去找元素
  await button.click(); // 這時才找元素並點擊

  // 好處：可以重複使用
  await button.click();
  await button.click(); // 每次都重新找元素
  ```

- [ ] **常見的 locator 策略？**
  ```javascript
  // 1. CSS Selector
  page.locator('#id')              // ID
  page.locator('.class')           // Class
  page.locator('button')           // Tag
  page.locator('[data-test="..."]') // Attribute（最推薦）

  // 2. Text
  page.locator('text=Login')       // 文字

  // 3. Role（accessibility）
  page.getByRole('button', { name: 'Login' })

  // 4. Test ID（最穩定）
  page.locator('[data-testid="login"]')
  ```

**動手練習：**
1. 開啟 https://www.saucedemo.com，練習寫不同的 locator
2. 比較 CSS selector, text, role 的差異
3. 故意寫一個錯的 locator，看錯誤訊息

### Day 3-4: 測試架構與最佳實踐

#### 1.4 AAA Pattern (Arrange-Act-Assert)

**必須理解的問題：**

- [ ] **什麼是 AAA Pattern？**
  ```javascript
  test('正確的帳密應該成功登入', async ({ page }) => {
    // Arrange（準備）- 設定測試資料和初始狀態
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Act（執行）- 執行要測試的動作
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert（驗證）- 檢查結果是否符合預期
    await expect(page).toHaveURL(/.*inventory/);
  });
  ```

- [ ] **為什麼要用 AAA Pattern？**
  1. 測試結構清晰
  2. 易於閱讀和理解
  3. 易於維護
  4. 其他人看得懂

- [ ] **如何判斷測試寫得好不好？**
  - 測試名稱清楚描述行為
  - AAA 三個階段明確分開
  - 一個測試只驗證一件事
  - 失敗時容易知道哪裡錯

**動手練習：**
1. 看 `tests/login.spec.js` 的每個測試，標示出 AAA 三個階段
2. 寫一個新測試：「空白帳號和密碼應該顯示錯誤」
3. 故意寫一個不符合 AAA 的測試，體會差異

#### 1.5 測試組織與命名

**必須理解的問題：**

- [ ] **測試檔案如何組織？**
  ```
  tests/
  ├── login.spec.js      # 登入相關測試（5 個）
  ├── cart.spec.js       # 購物車測試（3 個）
  └── checkout.spec.js   # 結帳測試（5 個）
  ```
  原則：按功能分類，每個檔案測試一個主要功能

- [ ] **測試案例如何命名？**
  ```javascript
  // ✅ 好的命名（清楚描述行為）
  test('正確的帳密應該成功登入')
  test('被鎖定帳號應顯示錯誤訊息')
  test('空白帳號應顯示 Username is required')

  // ❌ 不好的命名（太模糊）
  test('測試登入')
  test('test login function')
  test('should work')
  ```

- [ ] **測試案例設計原則？**
  1. **正向測試**（Happy Path）- 正確流程
  2. **負向測試**（Negative）- 錯誤處理
  3. **邊界測試**（Boundary）- 極端情況
  4. **獨立性** - 測試之間不相依

**動手練習：**
1. 檢視現有測試，看是否符合命名原則
2. 為購物車功能設計 3 個新的測試案例（只寫測試名稱）
3. 解釋為什麼要分成 login.spec.js 和 cart.spec.js

### Day 5-7: CI/CD 與 Docker

#### 1.6 GitHub Actions Workflow

**必須理解的問題：**

- [ ] **什麼是 CI/CD？**
  - CI (Continuous Integration)：持續整合，自動測試
  - CD (Continuous Deployment)：持續部署，自動發布

- [ ] **GitHub Actions 如何運作？**
  ```yaml
  # .github/workflows/e2e-test.yml

  # 觸發條件
  on:
    push:
      branches: [main]  # push 到 main 時執行

  # 工作
  jobs:
    test:
      runs-on: ubuntu-latest  # 在 Ubuntu 上執行

      steps:
        - name: Checkout code
          uses: actions/checkout@v4  # 下載程式碼

        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v3  # 設定 Docker

        - name: Build Docker Image
          uses: docker/build-push-action@v5  # 建立 Docker image
          with:
            cache-from: type=gha  # 使用 cache

        - name: Run Tests
          run: docker run playwright-e2e-demo  # 執行測試
  ```

- [ ] **為什麼需要 CI/CD？**
  1. 自動化 - 不用手動執行測試
  2. 快速反饋 - 有問題立刻知道
  3. 品質保證 - 每次 push 都測試
  4. 團隊協作 - 大家看同一個測試結果

**逐行理解 workflow：**

```yaml
# Step 1: 簽出程式碼
- name: Checkout code
  uses: actions/checkout@v4
# Q: 為什麼需要這步？
# A: GitHub Actions runner 是空的，要先下載程式碼

# Step 2: 設定 Docker Buildx
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
# Q: Buildx 是什麼？
# A: Docker 的進階建置工具，支援 cache 和平行建置

# Step 3: 建立 Docker Image
- name: Build Docker Image with Cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: false
    load: true
    tags: playwright-e2e-demo:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
# Q: cache-from 和 cache-to 做什麼？
# A: cache-from 讀取之前的 cache，cache-to 儲存新的 cache

# Step 4: 執行測試
- name: Run E2E Tests in Docker
  run: |
    docker run --rm \
      -v ${{ github.workspace }}/playwright-report:/app/playwright-report \
      -v ${{ github.workspace }}/allure-results:/app/allure-results \
      playwright-e2e-demo:latest
# Q: -v 參數做什麼？
# A: 把測試報告從容器掛載到 GitHub Actions runner
# Q: --rm 做什麼？
# A: 測試完成後自動刪除容器

# Step 5: 上傳報告
- name: Upload Allure Results
  uses: actions/upload-artifact@v4
  if: always()  # 即使測試失敗也上傳
  with:
    name: allure-results
    path: allure-results/
# Q: 為什麼要上傳？
# A: 讓後續的 job 可以使用這些檔案
```

#### 1.7 Docker 深入理解

**必須理解的問題：**

- [ ] **Dockerfile 每一行做什麼？**
  ```dockerfile
  # 基礎 image（已包含 Playwright 和瀏覽器）
  FROM mcr.microsoft.com/playwright:v1.57.0-jammy
  # Q: 為什麼選這個 image？
  # A: 官方 image，已安裝好所有依賴，不用自己裝

  # 設定工作目錄
  WORKDIR /app
  # Q: 為什麼要設定？
  # A: 之後的指令都在 /app 目錄執行

  # 複製 package files
  COPY package*.json ./
  # Q: 為什麼只複製 package.json？
  # A: 利用 Docker layer cache，package.json 不變就不用重裝

  # 安裝依賴
  RUN npm ci
  # Q: npm ci 和 npm install 差在哪？
  # A: npm ci 更快、更穩定，適合 CI 環境

  # 複製專案檔案
  COPY . .
  # Q: 為什麼這步放最後？
  # A: 程式碼常改，放最後可以最大化 cache 利用

  # 設定環境變數
  ENV CI=true

  # 預設執行測試
  CMD ["npm", "test"]
  ```

- [ ] **Docker Layer Cache 如何運作？**
  ```
  Layer 1: FROM playwright:v1.57.0     ← 很少變，cache hit
  Layer 2: COPY package*.json ./        ← 很少變，cache hit
  Layer 3: RUN npm ci                   ← package.json 不變就 cache hit
  Layer 4: COPY . .                     ← 常變，通常要重建
  Layer 5: CMD ["npm", "test"]          ← 沒變，cache hit

  第一次建置：2-3 分鐘（全部重建）
  第二次建置：30-60 秒（只重建 Layer 4）
  ```

- [ ] **docker-compose.yml 的用途？**
  ```yaml
  services:
    e2e-tests:
      build:
        context: .
        dockerfile: Dockerfile
      volumes:
        - ./playwright-report:/app/playwright-report
      environment:
        - TEST_ENV=${TEST_ENV:-production}
      command: npm test
  ```
  簡化 Docker 使用，一個指令啟動：`docker-compose up`

**動手練習：**
1. 在 Dockerfile 加上註解，解釋每一行
2. 試著改變 Dockerfile 順序，看 cache 效果
3. 解釋給非技術人員：「為什麼用 Docker？」

---

## 階段二：深入理解 API 測試專案

### Day 8-10: API 測試架構

#### 2.1 API 測試基礎

**必須理解的問題：**

- [ ] **API 測試在測什麼？**
  1. **功能性** - API 行為是否正確
  2. **回應格式** - JSON 格式是否正確
  3. **狀態碼** - 200, 201, 400, 404, 500
  4. **效能** - 回應時間是否合理
  5. **錯誤處理** - 錯誤訊息是否清楚

- [ ] **API 測試 vs E2E 測試？**
  | 比較項目 | API 測試 | E2E 測試 |
  |---------|---------|---------|
  | 速度 | 快（秒級） | 慢（分鐘級） |
  | 穩定性 | 高 | 較低（UI 會變） |
  | 覆蓋範圍 | 後端邏輯 | 完整流程 |
  | 何時使用 | 測試商業邏輯 | 測試使用者流程 |

- [ ] **HTTP Methods 差異？**
  ```javascript
  // GET - 取得資料（不修改）
  GET /api/users/1

  // POST - 新增資料
  POST /api/users
  Body: { name: "John", email: "john@test.com" }

  // PUT - 完整更新
  PUT /api/users/1
  Body: { name: "John", email: "john@test.com", age: 30 }

  // PATCH - 部分更新
  PATCH /api/users/1
  Body: { age: 31 }

  // DELETE - 刪除
  DELETE /api/users/1
  ```

#### 2.2 測試架構與設計

**必須理解的問題：**

- [ ] **為什麼要用 endpoints.js？**
  ```javascript
  // api/endpoints.js - 集中管理
  const API = {
    jsonplaceholder: {
      baseURL: 'https://jsonplaceholder.typicode.com',
      endpoints: {
        posts: '/posts',
        post: (id) => `/posts/${id}`,
      },
    },
  };

  // 好處：
  // 1. URL 變更只改一處
  // 2. 易於切換環境
  // 3. 程式碼更清晰
  ```

- [ ] **API 測試案例設計？**
  ```javascript
  // 1. 正向測試（Happy Path）
  test('GET 應該返回 200 並包含資料')
  test('POST 應該創建新資源並返回 201')

  // 2. 負向測試（Error Handling）
  test('GET 不存在的 ID 應該返回 404')
  test('POST 缺少必填欄位應該返回 400')

  // 3. 邊界測試（Boundary）
  test('GET 最後一個 ID 應該正常')
  test('POST 超長字串應該返回 400')

  // 4. 效能測試（Performance）
  test('回應時間應該小於 2 秒')
  ```

**動手練習：**
1. 看 `tests/jsonplaceholder/posts.spec.js`，標示出測試類型
2. 為 users API 設計 5 個測試案例（只寫名稱）
3. 解釋為什麼要分開測試不同的 API

### Day 11-12: 實作與問題排查

#### 2.3 常見問題與解決

**遇到問題時如何思考：**

1. **看錯誤訊息**
   ```
   Error: expect(received).toBe(expected)
   Expected: 200
   Received: 404

   → 思考：為什麼是 404？
   → 檢查：URL 是否正確？ID 是否存在？
   ```

2. **查看 request/response**
   ```javascript
   const response = await request.get(url);
   console.log('Status:', response.status());
   console.log('Body:', await response.json());
   ```

3. **縮小範圍**
   - 先測試簡單的（GET）
   - 再測試複雜的（POST）
   - 一次改一個東西

**動手練習：**
1. 故意寫錯 URL，看錯誤訊息
2. 故意寫錯 assertion，理解錯誤
3. 加入 console.log 觀察資料

---

## 階段三：實戰練習

### Week 3: 獨立實作

#### 3.1 新增測試案例

**練習 1：商品排序測試（E2E）**
```
需求：測試商品可以按照名稱排序

步驟：
1. 建立 SortingPage.js（如果需要）
2. 寫測試：
   - 預設排序應該是 A-Z
   - 選擇 Z-A 後商品順序應該反轉
   - 選擇價格低到高應該正確排序
3. 執行測試確認通過
```

**練習 2：Comments API 測試（API）**
```
API: https://jsonplaceholder.typicode.com/comments

任務：建立 comments.spec.js，包含：
1. GET /comments 應該返回所有評論
2. GET /comments/1 應該返回特定評論
3. GET /comments?postId=1 應該過濾評論
4. POST /comments 應該創建新評論
5. 回應時間應該小於 2 秒
```

#### 3.2 問題排查練習

**練習 3：Debug 失敗的測試**
```
我會故意弄壞一些測試，你要：
1. 找出問題
2. 解釋原因
3. 修復它
4. 說明學到什麼
```

#### 3.3 改善現有專案

**練習 4：加入截圖功能**
```
需求：測試失敗時自動截圖

步驟：
1. 研究 Playwright screenshot API
2. 在 playwright.config.js 設定
3. 測試：故意讓測試失敗，確認有截圖
```

**練習 5：加入測試重試**
```
需求：測試失敗自動重試 2 次

步驟：
1. 研究 Playwright retries 設定
2. 修改 playwright.config.js
3. 測試：寫一個 flaky test，確認會重試
```

---

## 階段四：技術深化與總結

### Day 20-22: 技術知識整合

#### 4.1 核心技術理解檢核

**E2E 專案核心觀念：**
- [ ] 為什麼選擇 Playwright？（比較 Selenium 的優劣）
- [ ] 為什麼用 Page Object Model？（設計模式理解）
- [ ] 如何處理動態元素？（實際應用場景）
- [ ] 如何處理 API 等待？（非同步處理）
- [ ] 測試失敗怎麼 debug？（問題排查流程）
- [ ] 為什麼要用 Docker？（環境一致性）
- [ ] CI/CD 流程是什麼？（自動化部署）
- [ ] 如何確保測試穩定性？（最佳實踐）

**API 專案核心觀念：**
- [ ] 為什麼做 API 測試？（測試金字塔）
- [ ] 如何設計測試案例？（測試策略）
- [ ] 如何處理認證？（安全性考量）
- [ ] 如何測試錯誤處理？（邊界測試）
- [ ] 如何測試效能？（效能指標）

**技術整合理解：**
- [ ] 整體測試策略是什麼？
- [ ] 如何平衡測試覆蓋率和執行時間？
- [ ] 遇到 flaky test 怎麼處理？
- [ ] 如何與團隊協作和溝通？

#### 4.2 專案完整度檢核

**技術文件準備：**

1. **專案架構圖**
   ```
   - 繪製 E2E 專案架構圖
   - 繪製 API 測試流程圖
   - 標註各元件職責
   ```

2. **技術決策文件**
   ```
   記錄重要的技術決策：
   - 為什麼選 Playwright 而非 Selenium
   - 為什麼採用 Page Object Model
   - 為什麼使用 Docker 容器化
   - CI/CD 流程設計考量
   ```

3. **最佳實踐總結**
   ```
   整理學到的最佳實踐：
   - 測試案例設計原則
   - 錯誤處理策略
   - 效能優化技巧
   - 團隊協作經驗
   ```

4. **未來改進方向**
   ```
   規劃專案未來發展：
   - 視覺回歸測試
   - 效能測試整合
   - 測試報告優化
   - 更多測試覆蓋
   ```

**技術深化練習：**
1. 撰寫一份技術分享文件（給團隊參考）
2. 整理常見問題的解答（知識庫）
3. 記錄踩過的坑和解決方案

---

## 常見問題 FAQ

### 技術問題

**Q1: async/await 和 Promise 有什麼差別？**
```javascript
// Promise
page.goto('/').then(() => {
  return page.click('#button');
}).then(() => {
  return page.textContent('h1');
}).then((text) => {
  console.log(text);
});

// async/await（更清楚）
await page.goto('/');
await page.click('#button');
const text = await page.textContent('h1');
console.log(text);
```

**Q2: 為什麼有時候不用 await？**
```javascript
// 需要 await（非同步操作）
await page.click('#button');  // 點擊需要時間
await page.goto('/');          // 頁面載入需要時間

// 不需要 await（同步操作）
const locator = page.locator('#button');  // 只是定義 locator
const url = page.url();                   // 取得當前 URL（同步）
```

**Q3: 什麼時候用 const、let、var？**
```javascript
const name = 'John';  // 不會改變的值（最常用）
let age = 30;         // 會改變的值
var old = 'old';      // 不要用（舊語法）

// 最佳實踐：優先用 const，需要改變才用 let
```

**Q4: module.exports 和 export 有什麼差別？**
```javascript
// CommonJS（Node.js 預設，你的專案用這個）
module.exports = LoginPage;
const LoginPage = require('./LoginPage');

// ES Modules（較新，瀏覽器用）
export default LoginPage;
import LoginPage from './LoginPage';
```

**Q5: 測試失敗常見原因？**
1. **Selector 錯誤** - 元素找不到
2. **Timing 問題** - 操作太快，元素還沒出現
3. **環境問題** - 測試環境不穩定
4. **資料問題** - 測試資料被改變
5. **斷言錯誤** - 預期值寫錯

### 職涯問題

**Q6: 手動 QA 轉自動化需要會什麼？**
1. **基礎程式語言**（JavaScript/Python）
2. **測試框架**（Playwright/Selenium）
3. **API 測試**（Postman/REST）
4. **版本控制**（Git）
5. **CI/CD 概念**（GitHub Actions）
6. **基礎 Linux 指令**
7. **Docker 基礎**（加分）

**Q7: SDET 技術要求到什麼程度？**
- ✅ 能獨立寫測試（有範例可參考）
- ✅ 能解釋程式碼邏輯和設計決策
- ✅ 能 debug 基本問題
- ✅ 能用 Git 管理程式碼
- ✅ 理解 CI/CD 概念和實作
- ❌ 不需要：從零開始寫框架
- ❌ 不需要：精通演算法和資料結構

**Q8: 業界 SDET 常見的技術要求？**
依據職位層級：
- **自動化 QA**：能讀懂和維護測試程式碼
- **SDET**：能獨立開發測試、設計框架
- **Senior SDET**：能規劃測試策略、指導團隊

**Q9: 不同角色的技術深度差異？**
技術要求參考：
- **手動 QA**：測試執行、Bug 報告
- **自動化 QA**：測試腳本開發、維護
- **SDET**：測試框架設計、CI/CD 整合
- **Senior SDET**：技術選型、架構設計

---

## 學習檢核表

### 基礎觀念（必須全部打勾）

**JavaScript 基礎：**
- [ ] 理解 async/await
- [ ] 理解 class 和 constructor
- [ ] 理解 this 關鍵字
- [ ] 理解 const/let 差異
- [ ] 理解 module.exports

**Playwright 基礎：**
- [ ] 理解 locator 概念
- [ ] 知道常見 selector 策略
- [ ] 理解 auto-wait 機制
- [ ] 會用基本 API（click, fill, goto）
- [ ] 會寫基本斷言（expect）

**測試基礎：**
- [ ] 理解 AAA Pattern
- [ ] 知道如何組織測試
- [ ] 會設計測試案例
- [ ] 理解測試獨立性

### 進階觀念（至少 80% 打勾）

**架構設計：**
- [ ] 深入理解 Page Object Model
- [ ] 知道 POM 的優缺點
- [ ] 能判斷何時用/不用 POM
- [ ] 理解程式碼重用概念

**API 測試：**
- [ ] 理解 HTTP Methods 差異
- [ ] 會測試不同狀態碼
- [ ] 會驗證 JSON 格式
- [ ] 會測試錯誤處理

**DevOps：**
- [ ] 理解 Docker 基礎
- [ ] 理解 CI/CD 概念
- [ ] 能解釋 GitHub Actions workflow
- [ ] 理解 Docker Layer Cache

### 實作能力（至少 70% 打勾）

**獨立開發：**
- [ ] 能獨立新增測試案例
- [ ] 能修改現有測試
- [ ] 能找出並修復 bug
- [ ] 能查閱文件解決問題

**問題排查：**
- [ ] 看得懂錯誤訊息
- [ ] 知道如何 debug
- [ ] 會用 console.log 除錯
- [ ] 會查 Playwright 文件

**專案管理：**
- [ ] 會用 Git 基本指令
- [ ] 會建立 commit
- [ ] 會 push 到 GitHub
- [ ] 理解 .gitignore

### 技術深化與總結（必須全部打勾）

**專案理解深度：**
- [ ] 能清楚說明專案架構（完整理解）
- [ ] 能解釋技術選型原因（設計決策）
- [ ] 能說明設計權衡（trade-offs）
- [ ] 能獨立展示和講解專案

**技術知識掌握：**
- [ ] 整理好技術要點筆記
- [ ] 能解釋每個檔案的用途和設計
- [ ] 記錄踩過的坑和解決方案
- [ ] 規劃好未來改進方向

**核心概念理解：**
- [ ] 深入理解 async/await 機制
- [ ] 深入理解 Page Object Model 設計模式
- [ ] 深入理解 Docker 容器化優勢
- [ ] 深入理解 CI/CD 完整流程

---

## 學習資源

### 官方文件
- [Playwright 官方文件](https://playwright.dev)
- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Docker 官方教學](https://docs.docker.com/get-started/)

### 推薦文章
- [Page Object Model 最佳實踐](https://playwright.dev/docs/pom)
- [AAA Pattern 詳解](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)

### 練習資源
- [Test Automation University](https://testautomationu.applitools.com/)
- [Playwright 範例](https://github.com/microsoft/playwright/tree/main/examples)

---

## 學習進度追蹤

### Week 1: E2E 專案
- [ ] Day 1-2: 完成專案架構理解
- [ ] Day 3-4: 完成測試架構理解
- [ ] Day 5-7: 完成 CI/CD 理解
- [ ] 週末：複習 + 問問題

### Week 2: API 專案
- [ ] Day 8-10: 完成 API 測試理解
- [ ] Day 11-12: 完成問題排查
- [ ] Day 13-14: 完整複習兩個專案
- [ ] 週末：技術 review 和筆記整理

### Week 3: 實戰練習
- [ ] Day 15-17: 完成 3 個實作練習
- [ ] Day 18-19: 完成專案改善和優化
- [ ] Day 20-21: 技術深化與知識整合

### Week 4: 技術整合與提升
- [ ] Day 22-24: 技術文件撰寫
- [ ] Day 25-26: 核心觀念複習和強化
- [ ] Day 27-28: 規劃下一階段學習目標

---

## 下一步行動

### 立即開始（現在就做）
1. [ ] 把這份文件完整讀一遍
2. [ ] 在每個章節標示「已理解」或「需要幫助」
3. [ ] 建立學習筆記（可以用 Notion, Obsidian, 或純文字）

### 本週目標
1. [ ] 完成 Day 1-2 的所有問題
2. [ ] 實作至少 1 個練習
3. [ ] 問至少 10 個問題（問 Claude）

### 本月目標
1. [ ] 完成所有檢核表項目
2. [ ] 能深入講解兩個專案的技術細節
3. [ ] 建立個人技術知識庫
4. [ ] 規劃下一階段技能提升方向

---

## 給 Claude 的提示

如果對話中斷，Jay 可以這樣恢復學習：

```
請繼續協助我提升 SDET 技術能力，
我們上次學到：[章節名稱]，
我目前的問題是：[具體問題]

請參考這份學習計畫：
/Users/jay.huang/Projects/playwright-e2e-demo/docs/learning-roadmap.md
```

---

## 學習心態

**記住幾個重點：**
1. 學習程式不是要「全部會」，而是要「會用」+ 「能持續學習」
2. 遇到問題是正常的，重點是學會如何解決問題
3. 實作比理論重要，動手做才是真正的學習
4. 建立自己的知識體系，整理筆記和文件

**技能提升的關鍵：**
- ✅ 深入理解而非囫圇吞棗
- ✅ 實際動手練習
- ✅ 記錄問題和解決方案
- ✅ 持續優化和改進

---

**文件版本**: v1.1 (已調整為內部學習用)
**建立日期**: 2025-01-14
**最後更新**: 2025-01-14
**用途**: Jay 的 SDET 技能提升計畫
**協作**: Claude as Technical Mentor
