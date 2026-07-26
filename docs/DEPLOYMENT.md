# 部署設定

## 正式環境

### Cloudflare Pages

- 專案根目錄：`frontend`
- 正式分支：`main`
- Build command：`npm ci && npm run build`
- Build output：`dist`
- 綁定網域：`paper-cut.org`、`www.paper-cut.org`、`admin.paper-cut.org`

正式環境變數：

```env
VITE_API_URL=https://api.paper-cut.org
VITE_ADMIN_HOST=admin.paper-cut.org
VITE_ADMIN_BASE_PATH=/panel
NODE_VERSION=22
```

### Railway

- Spring profile：`prod`
- API 網域：`https://api.paper-cut.org`
- 健康檢查：`/paper/api/actuator/health`

必要環境變數：

```env
SPRING_PROFILES_ACTIVE=prod
MYSQLHOST=
MYSQLPORT=
MYSQLDATABASE=
MYSQLUSER=
MYSQLPASSWORD=
JWT_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET=
R2_ENDPOINT=
R2_PUBLIC_URL=
CORS_ALLOWED_ORIGINS=https://paper-cut.org,https://www.paper-cut.org,https://admin.paper-cut.org,http://localhost:5173
```

`JWT_SECRET` 必須使用至少 32 bytes 的隨機值。所有機密只存於 Railway，不可提交至 Git。

## Staging

- 使用獨立 Cloudflare Pages staging 專案，但沿用同一個 `frontend` 程式
- Pages 正式分支：`development`
- 前台網域：`staging.paper-cut.org`
- 後台網域：`admin-staging.paper-cut.org`
- Railway profile：`staging`
- API：`https://api-staging.paper-cut.org`
- 使用獨立 MySQL 與 R2 bucket
- 不得使用正式資料或正式憑證

Pages Preview 變數：

```env
VITE_API_URL=https://api-staging.paper-cut.org
VITE_ADMIN_HOST=admin-staging.paper-cut.org
VITE_ADMIN_BASE_PATH=/panel
NODE_VERSION=22
```

Railway staging 必須設定 `SPRING_PROFILES_ACTIVE=staging`，並設定：

```env
CORS_ALLOWED_ORIGINS=https://staging.paper-cut.org,https://admin-staging.paper-cut.org
```

Staging 啟動時預設會以 `ADMIN_PASSWORD` 同步既有初始管理者的密碼；修改密碼後必須
重新部署 Railway。若需保留資料庫中的密碼，可設定 `ADMIN_SYNC_PASSWORD=false`。
正式環境預設不啟用此同步。

因 Cookie 請求不接受萬用來源，不可設定 `*`。Staging 前端與 API 應維持在
`paper-cut.org` 的子網域，避免登入 Cookie 變成跨站 Cookie。

Cloudflare Access 必須同時保護 staging 前端與 staging API。另以回應標頭
`X-Robots-Tag: noindex, nofollow` 禁止索引，且不提交 staging sitemap。

## Cloudflare 安全規則

- 對 `/paper/api/auth/login` 設定 IP 頻率限制。
- 僅允許必要 HTTP 方法。
- `api.paper-cut.org` 與 `api-staging.paper-cut.org` 必須啟用 HTTPS。
- staging 僅允許指定管理者通過 Cloudflare Access。

後端另有「帳號 + IP」登入限制：15 分鐘內失敗 5 次，封鎖 15 分鐘。若 Railway
擴充為多個 instance，需將此計數改存 Redis 或其他共用儲存。

## GitHub

Repository ruleset 應保護 `main`：

- 必須經 Pull Request 合併。
- 必須通過 `backend` 與 `frontend` CI。
- 禁止直接 push 與 force push。
- staging 驗證完成後才可合併至 `main`。
