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

### Railway JVM 記憶體限制

`backend/railpack.json` 沿用 Railpack 的 Maven 建置與 `JAVA_OPTS` 啟動參數機制，
只覆寫服務啟動命令。預設為：

```text
-Xms128m -Xmx512m -XX:MaxMetaspaceSize=192m
```

- Heap 初始值 128 MiB、上限 512 MiB；Metaspace 上限 192 MiB。
- `JAVA_OPTS` 放在預設限制之後，可個別覆寫，例如
  `JAVA_OPTS=-XX:MaxMetaspaceSize=256m`，其餘限制仍保留。
- `PORT` 未設定時使用 8080；Railway 網域的 target port 必須與服務監聽埠一致。
- `exec` 讓 Java 接收容器停止訊號；JAR 沿用 Maven 的 `target/*.jar`，不綁定版本號。
- 不在全域設定 `JAVA_TOOL_OPTIONS`，避免同時限制 Maven／編譯器 JVM。
  若另有 `JAVA_TOOL_OPTIONS` 或 `_JAVA_OPTIONS`，啟用前先檢查是否有重複記憶體參數；
  本啟動命令的記憶體調整統一使用 `JAVA_OPTS`。參數中不得放入密碼或金鑰。
- `application*.properties` 在 JVM 啟動後才讀取，無法用來設定 Heap 上限。

2026-09-11 唯讀確認：production 與 staging 都使用 `RAILPACK`、Root Directory
`/backend`，分別追蹤 `main` 與 `development`，沒有自訂 Start Command；服務層
沒有 `JAVA_OPTS` 或 `JAVA_TOOL_OPTIONS`。既有文件要求 staging 驗證，但實際驗證
是否完成仍需以部署紀錄為準。

日後經授權啟用時：

1. 先在 staging 驗證。Root Directory 維持 `/backend`，讓 Railpack 讀取
   `backend/railpack.json`；保留現有建置器、建置命令與秘密變數。
2. 確認沒有 Dashboard Start Command、`RAILPACK_START_CMD` 或
   `RAILPACK_CONFIG_FILE` 覆寫此設定，並在建置／部署資訊核對實際啟動命令。
3. 觀察 `/paper/api/actuator/health`、登入、查詢、圖片上傳與 Excel 匯入，
   特別檢查 `OutOfMemoryError`、`Metaspace`、GC 壓力及容器重啟。
4. 若 Metaspace 不足，先透過 `JAVA_OPTS=-XX:MaxMetaspaceSize=256m` 增加空間；
   若 Heap 不足，依負載評估增加 `-Xmx`。每次調整都須重新驗證。
5. 完成 staging 負載驗證並取得正式部署授權後，才套用 production。

512 MiB 是 Heap 上限，並非整個容器的 RAM 上限；執行緒 stack、code cache、
直接記憶體與其他 native allocation 仍會佔用 RAM。Metaspace 192 MiB 也不保證
適合所有負載。實際節費須比較部署前後相同流量與觀察期間的 Railway 指標。

本機 JDK 21 驗證：初始 Metaspace 128 MiB 限制下，格式檢查、11 項既有測試與打包通過；HTTP 健康端點回傳 200／UP。但啟動後 Metaspace 已使用約 111 MiB，因此最終上限提高為 192 MiB，保留類別載入空間。測試使用 test profile 與 H2，未驗證正式 MySQL、R2 或實際流量。專案編譯目標與 CI 仍為 Java 17。

上述本機驗證階段未更新 Railway 設定或觸發部署；雲端發布狀態請以 GitHub PR 與 Railway 部署紀錄為準。

參考：[Railpack 設定檔](https://railpack.com/config/file/)、
[Railpack Java 啟動實作](https://github.com/railwayapp/railpack/blob/main/core/providers/java/java.go)。

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
