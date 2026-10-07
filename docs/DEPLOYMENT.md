# 部署設定

流程整理日期：2026-10-07。平台與環境值沿用既有部署紀錄，本輪未查驗雲端即時狀態，也未調整設定。
2026-09-14 的部署、效能及 staging 下線結果保留為歷史證據，不代表目前版本已驗證。

## 現行發布流程

Staging 已下線；本機測試與 CI 可先執行，但不能取代 MySQL、R2、跨網域 Cookie 等必要整合驗證。
新版本依 [開發規劃](DEVELOPMENT_PLAN.md) 完成適用測試及 UAT；隔離環境不足時記錄缺口，
先決定驗證安排，不直接改在正式環境執行寫入或負載測試。重建 staging 需使用者另行確認。

### 發布前

1. 記錄發布範圍、提交版本、影響的 API／資料庫／R2／環境變數及負責人。
2. 完成審查、必要 CI、適用的整合測試、回歸及 UAT，保留相同版本的結果。
3. 查核 Cloudflare Pages、Railway、網域與目前分支保護設定；以下平台設定須以實際服務核對。
4. 核對前端 API URL、後端 profile、CORS、Cookie 及秘密變數；只記錄名稱、環境與用途，不記錄秘密值。
5. 若涉及資料變更，確認備份、隔離還原演練與版本相容性；若不涉及，明列不適用的理由。
6. 準備回復方案並處理重大缺陷與必要驗證缺口，確認正式發布授權。
7. 合併前確認自動部署觸發規則；合併或推送至正式分支可能直接觸發發布。

### 回復方案

每次發布記錄前一個可用提交及前後端部署 ID、回復觸發條件、執行者、操作方式與驗證步驟。
部署 ID 必須於當次發布核對，不直接重用下方歷史紀錄。

程式回復與資料復原須分別規劃：程式退版不會自動還原 MySQL 或 R2。
涉及 schema 或檔案刪除時，先確認舊版本相容性、備份可用性與復原順序，避免以退版代替資料處理。

### 發布後

1. 核對實際前後端版本、部署結果及健康端點。
2. 驗證作品列表、搜尋、詳情及此次變更的必要流程；寫入驗證須另有受控測試安排。
3. 在事先定義的觀察期間檢查錯誤率、延遲、RAM、容器重啟與資料庫連線。
4. 發生預定回復條件時執行已確認方案，記錄原因及結果。
5. 更新 CURRENT_STATUS 與發布紀錄，不把健康端點成功等同全部功能驗收。

發布紀錄至少包含：日期、範圍、提交、環境、部署 ID、測試證據、驗收者、發布授權、
設定變更、備份／回復方案、已知限制、發布後結果與觀察期間。



## 正式環境

### Cloudflare Pages

- 專案根目錄：`frontend`
- 正式分支：`main`
- Build command：`npm run build`（Cloudflare 會先自動執行 `npm clean-install`）
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

JVM 調整的驗證流程：

以下是技術檢查順序；歷史 staging 已下線。先在本機隔離環境驗證，可用的雲端整合驗證方式須另行安排。

1. 先在隔離環境驗證；若經確認重建 staging，再驗證 Railway 的實際啟動行為。Root Directory 維持 `/backend`，讓 Railpack 讀取
   `backend/railpack.json`；保留現有建置器、建置命令與秘密變數。
2. 確認沒有 Dashboard Start Command、`RAILPACK_START_CMD` 或
   `RAILPACK_CONFIG_FILE` 覆寫此設定，並在建置／部署資訊核對實際啟動命令。
3. 觀察 `/paper/api/actuator/health`、登入、查詢、圖片上傳與 Excel 匯入，
   特別檢查 `OutOfMemoryError`、`Metaspace`、GC 壓力及容器重啟。
4. 若 Metaspace 不足，先透過 `JAVA_OPTS=-XX:MaxMetaspaceSize=256m` 增加空間；
   若 Heap 不足，依負載評估增加 `-Xmx`。每次調整都須重新驗證。
5. 完成適用的隔離整合及負載驗證，依本文件現行發布流程取得正式部署授權後，才套用 production；未測項目明列，不視為通過。

512 MiB 是 Heap 上限，並非整個容器的 RAM 上限；執行緒 stack、code cache、
直接記憶體與其他 native allocation 仍會佔用 RAM。Metaspace 192 MiB 也不保證
適合所有負載。實際節費須比較部署前後相同流量與觀察期間的 Railway 指標。

本機 JDK 21 驗證：初始 Metaspace 128 MiB 限制下，格式檢查、11 項既有測試與打包通過；HTTP 健康端點回傳 200／UP。但啟動後 Metaspace 已使用約 111 MiB，因此最終上限提高為 192 MiB，保留類別載入空間。測試使用 test profile 與 H2，未驗證正式 MySQL、R2 或實際流量。專案編譯目標與 CI 仍為 Java 17。

2026-09-14 部署與驗證結果（本機執行紀錄）：

- PR #101 已合併至 `development`；staging 部署
  `376ec729-b6bf-4dda-8769-9a268f00900a` 使用 `b824fe4`，Railway 狀態為 SUCCESS。
- 使用者明確授權正式部署及僅針對 PR #102 使用管理員合併。
  PR https://github.com/LinWeiChun/Paper-art/pull/102 已於台灣時間
  2026-09-14 09:29 合併至 `main`，提交為
  `33856bcfc79b08a8aa5156c513005bdd4bfc565e`。分支保護規則未修改，
  原有 1 位審查者要求仍保留。PR 與合併後的前後端 CI 均通過；
  合併後 CI：https://github.com/LinWeiChun/Paper-art/actions/runs/34796078827。
- Railway production 部署 `d6fedfeb-3177-42b8-b6e9-914e3d466825` 為 SUCCESS，
  對應上述 main 提交。建置日誌確認讀取 `railpack.json` 並使用
  `exec java -Xms128m -Xmx512m -XX:MaxMetaspaceSize=192m $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar target/*.jar`。
- 啟動日誌確認 Java 21.0.2、`prod` profile、MySQL 連線與 8080 埠正常，
  Spring Boot 約 5.2 秒完成啟動。檢查期間未見 OutOfMemoryError、ERROR 或重複啟動。
- 正式健康端點為 HTTP 200／UP；作品列表（18 筆）、既有作品詳情、分類、
  CSRF、空條件搜尋與關鍵字搜尋均成功，正式網站也回傳 HTTP 200。
  本次未驗證登入、圖片上傳、Excel 匯入或負載測試。
- 正式 Java 部署前近 24 小時 RAM 平均 0.8466 GB；台灣時間約 09:33 的
  最新樣本為 0.5073 GB，初步下降約 40%。此為上線後短期樣本；
  最近一小時平均值仍包含舊版本，不可當作新版本穩態平均。
  實際月費與長期降幅須以相同流量、完整觀察期間比較。
- staging Java 近 24 小時平均 0.5615 GB；MySQL production／staging 平均
  分別為 0.4652 GB／0.3750 GB，均為此次正式發布前取得的比較基準。
- Root Directory 維持 `/backend`、建置器維持 RAILPACK；無須新增環境變數。
  本次未變更 Railway 訂閱方案、MySQL、休眠設定、R2 或前端程式。
- 原工作區的 `development` 分支與未提交檔案保留；本段上線結果僅更新於
  本機文件，PR #102 中的部署文件記錄的是正式發布前的 staging 驗證。

參考：[Railpack 設定檔](https://railpack.com/config/file/)、
[Railpack Java 啟動實作](https://github.com/railwayapp/railpack/blob/main/core/providers/java/java.go)。

## Staging（已下線）

2026-09-14 依使用者要求完成下線，並明確允許不保留測試資料庫資料：

- Railway `paper-art` 的 staging 環境 `28e30da3-26e8-4181-8ff3-8f899c459271`
  已刪除，包含 staging Java、MySQL 與該環境的測試資料；目前僅剩 production。
  正式 Java 與 MySQL 部署仍為 SUCCESS，正式 MySQL volume 保留。
- Cloudflare Pages `paper-art-staging` 專案與部署紀錄已刪除，專案列表僅剩
  正式 `paper-art`，正式網域維持 `paper-cut.org`、`www.paper-cut.org`、`admin.paper-cut.org`。
- 使用者已刪除 staging、admin-staging、api-staging 三筆 DNS 記錄，
  權威 DNS 驗證三個完整子網域均回覆名稱不存在；兩個 staging Pages
  自訂網域綁定也已解除。
- GitHub `development` 分支、程式與 R2 檔案保留，未刪除或修改 Cloudflare Access 規則。
  已刪除的 Railway 環境與 Pages 專案不會因推送而自行重建；
  正式 Pages 專案本身的 preview 分支設定未變更。
- staging 已無執行中的 Railway 部署，原約 0.94 GB 的 staging RAM 用量來源已移除。
  帳單中已累積的用量不會因此消失，實際節費以後續帳單為準。
- 本節下線結果為本機文件更新，未提交或推送；不代表原有 staging 端對端測試已完成。

### 歷史設定與日後重建參考

以下設定僅供參考，不代表 staging 仍在線。原部署流程中的 staging 驗證階段現已暫停；
若要恢復此流程，須先取得使用者重建環境的確認，建立新的測試資料庫並重新驗證。

- 使用獨立 Cloudflare Pages staging 專案，但沿用同一個 `frontend` 程式
- Pages 正式分支：`development`
- 前台網域：`staging.paper-cut.org`
- 後台網域：`admin-staging.paper-cut.org`
- Railway profile：`staging`
- API：`https://api-staging.paper-cut.org`
- 使用獨立 MySQL 與 R2 bucket
- 不得使用正式資料或正式憑證

Staging Pages 專案的 Production 變數：

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
- `api.paper-cut.org` 必須啟用 HTTPS。
- 若經確認重建 staging，其 API 亦須啟用 HTTPS，並僅允許指定管理者通過 Cloudflare Access。

後端另有「帳號 + IP」登入限制：15 分鐘內失敗 5 次，封鎖 15 分鐘。若 Railway
擴充為多個 instance，需將此計數改存 Redis 或其他共用儲存。

## GitHub

以下為應查核的目標規則；2026-09-14 曾記錄審查者要求，本輪未重新確認 GitHub 實際設定。

Repository ruleset 應保護 `main`：

- 必須經 Pull Request 合併。
- 必須通過 `backend` 與 `frontend` CI。
- 禁止直接 push 與 force push。
- 合併前完成本次範圍的必要測試、驗收及發布檢查；staging 暫停不代表自動免除整合驗證。
- 若已確認重建 staging，應完成該環境驗證；若仍下線，需完成已確認的替代驗證安排並記錄限制。
