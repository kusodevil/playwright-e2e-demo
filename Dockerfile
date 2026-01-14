# 使用 Playwright 官方 image，已包含瀏覽器
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# 設定工作目錄
WORKDIR /app

# 複製 package files
COPY package*.json ./

# 安裝 dependencies
RUN npm ci

# 複製專案檔案
COPY . .

# 設定環境變數
ENV CI=true

# 預設執行測試
CMD ["npm", "test"]
