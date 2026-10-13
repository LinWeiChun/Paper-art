# M2-06：R1 同版開發驗證

執行日期：2026-10-12～13；執行者：Codex。使用者負責業務與真人 UAT。

**狀態：本機審查、Java 17／Node 22、MySQL 與本批瀏覽器抽樣已完成；遠端 GitHub CI 尚未執行，M2-06 保留未勾選。未推送、部署或 UAT。**

## 1. 候選與範圍

- 分支：`codex/m2-06-verification`。
- 比較基準：`b4ee38bb366bfecf0192a28670f8c31ddf0cdf7f`。
- 最終程式候選：`4bf3bfe0dcffb5d72f1bd6f14abe0163d5aec799`；後續證據文件提交不變更此候選程式。
- 納入 M2-01 搜尋輸入／錯誤分類／穩定排序、M2-05 安全回歸及追蹤修正、本次發現的兩項 CSRF 核心流程缺陷。
- 維持公開資格、API、框架、套件、DB schema、R2 與部署變數。未使用真實 R2。
- [版本與驗證摘要](evidence/M2_06/validation.json) 保存環境、計數與關鍵檔案 SHA-256。

本機提交依序為 `8b22098`（前批實作、測試及文件）、`979d2ec`（測試格式）、`9a72e2c`（瀏覽器 fixture）、`fb30335`（首次搜尋競態）、`4bf3bfe`（登入後 CSRF Cookie）。前四版只作診斷歷史，不代表最終候選通過。

## 2. 本次缺陷與修正

### BUG-CSRF-INIT-01：首次作品搜尋 403（S1，本機已修）

首次作品頁並行請求 `/auth/csrf`、`/authors`、`/categories`。既有 `setCsrfRequestAttributeName(null)` 強制普通 GET 也產生 token；後到的作者／分類回應覆蓋 Cookie，前端保留先前 token，搜尋回 403 並顯示空白。重新載入後可恢復。

- 瀏覽器原始證據：2026-10-13 09:39:41，搜尋 403，traceId `e101e0a6-16e1-4015-8320-5cefc35affe2`。
- 固定重現：`initialParallelReadsDoNotInvalidateSearchCsrf` 兩種回應順序，修正前 2 失敗（預期 200，實際 403），修正後 2 通過。
- 修正：移除強制初始化，保留 `/auth/csrf` 明確取得 token 及寫入方法的 token 比對。

### BUG-CSRF-JWT-01：登入後讀取使登出 403（S1，本機已修）

真實 HTTP 及瀏覽器確認：登入成功後，帶 JWT 與 CSRF Cookie 呼叫 `/auth/me`，回應刪除 CSRF Cookie；後續登出回 403。前批 MockMvc 的 `/auth/me` 只帶 JWT，未套用 CSRF Cookie 的刪除回應，故未捕捉此問題。

- 原始證據：2026-10-13 09:49:00，登出 403，traceId `f6361827-1c56-4aca-844d-b1ef9fd5c691`。
- Spring Security 6.5.1 本機原始碼確認：`STATELESS` 仍配置隱式 Session 認證策略，`NullSecurityContextRepository.containsContext()` 為 false；每次 JWT 建立認證都觸發 `CsrfAuthenticationStrategy` 清除 Cookie。
- 固定重現：`authenticatedReadsPreserveCsrfForSubsequentWrites` 帶完整 Cookie 並套用替換／刪除回應，修正前預期 204、實際 403。
- 修正：僅替換 CSRF 的 Session 認證策略為 `NullAuthenticatedSessionStrategy`，不把每次 JWT 驗證視為新登入。保留 `CsrfFilter`、Cookie/header 比對、Cookie 安全屬性及全部路由權限。
- 真實 HTTP 最終結果：`login=200 me=200 csrfUnchanged=True logout=204 afterLogout=401`。
- 此架構不在每次 JWT 認證旋轉 CSRF token；沒有加入 JWT 撤銷機制。登出清除客戶端 Cookie，不能宣稱已複製的 JWT 失效。

### 測試入口修正

新增 [BrowserVerificationIT.java](../backend/src/test/java/com/paperart/backend/diagnostics/BrowserVerificationIT.java)，明確 opt-in、僅監聽 `127.0.0.1:33317`，固定記憶體 H2、mock S3／清理排程，提供公開兩件與草稿一件作品。首次 fixture 缺 `created_at` 啟動失敗，已補齊時間欄位；格式與 Windows 換行差異亦已修正。入口通過只證明隔離服務運作及未呼叫儲存，不當作瀏覽器驗收計數。

## 3. Standards

依 `code-review` 技能獨立檢查規範，先比較基準與候選，再逐次檢視增量至 `4bf3bfe`。**0 項需修正發現。**

- 沿用既有 Controller／DTO／Service／錯誤處理與安全設定，符合 AGENTS 的最小修改及架構要求。
- 追蹤先於 CORS／CSRF，JWT 維持認證階段；未放寬 matcher 或權限。
- 最後的替代策略只影響認證階段清除 token，仍建立原有 CSRF filter；已核對本機框架原始碼。
- fixture 固定隔離資料庫、mock 儲存／排程；HTTP 記錄不包含 Cookie、Authorization 或登入本文。
- 測試 helper 少量重複保留情境可讀性，未建議無關重構。

## 4. Spec

依同一技能獨立比對已確認契約與 M2-01／05／06，增量審查至 `4bf3bfe`。**0 項需修正發現。**

- keyword 200、size 100、非法參數 400、未知錯誤 500、同值 ID 升冪及原公開規則符合已確認需求。
- 認證、角色、CSRF／CORS、登入限制及管理抽樣符合本批範圍。
- 兩項新回歸模擬實際 Cookie 回應交錯／清除行為，沒有停用 CSRF 或模擬內部業務 Service。
- 未擅自實作其餘待確認搜尋契約、M3／M4 功能。

審查總計：Standards 0、Spec 0；兩軸均無阻斷發現。此為 Codex 審查，非 GitHub 保護規則要求的人員核准。

## 5. 最終候選測試

| 檢查 | 環境／結果 | 證據 |
|---|---|---|
| 完整後端＋Spotless | Windows、Temurin 17.0.20.1+1；65 通過，0 失敗／錯誤／略過 | `backend/target/m2-06-release-tests.log`，2026-10-13 14:39:11 完成 |
| MySQL 搜尋回歸 | MySQL 9.7.2、utf8mb4_0900_ai_ci；22 通過 | `backend/target/m2-06-release-mysql.log`，14:40:06 完成 |
| 前端 lint／build | Node 22.23.3、npm 10.9.9；0 錯誤、53 既有警告；build 通過、大 chunk 警告 | `m2-06-release-lint.log`、`m2-06-release-build.log` |
| 依賴安裝 | 2026-10-12 同分支 `npm ci` 成功；後續未改前端或鎖定檔 | `m2-06-npm-ci.log`、validation.json 鎖定檔雜湊 |
| 真實 HTTP Cookie | 登入 200 → me 200／CSRF 不變 → 登出 204 → me 401 | `m2-06-http-cookie-final.log` |
| 本機瀏覽器 | Codex in-app Chromium；HTTP localhost 不同埠 | 下表、[HTTP 記錄](evidence/M2_06/browser-http.log)與截圖 |
| 遠端 CI | **未執行** | 沒有此候選的 GitHub Actions run；本機 Windows 不冒充 Ubuntu CI |

65 項為前批 62＋首次搜尋競態 2＋認證後 CSRF 1。MySQL 22 為相同搜尋案例的另一 DB 執行，不當作 22 項新增測試。瀏覽器入口另執行，不列入 65 項。

最終 Node 22 工具及 Java 17 ZIP 來自官方來源，下載後核對 SHA-256，放在忽略的 `backend/target/m2-06-tools`，未改系統安裝。MySQL 為本次專用、無既有資料 volume 的容器，不是正式版本查核。

### 瀏覽器抽樣

| 案例 | 結果與界線 |
|---|---|
| 零筆搜尋 | API 200，舊卡片清除；缺少明確空結果文案，留 M2-03 |
| 關鍵字春花／清除條件 | 200，正確顯示 1／2 件公開作品，草稿未出現在公開列表 |
| 公開詳情及返回 | 前一候選 `fb30335` 已驗證詳情 200、返回保留 search/page；最終候選另有 API 回歸，未重做完整返回／捲動 QA |
| 管理登入、讀取、登出、再登入、再登出 | 最終候選完成；登入及管理 API 200，兩次登出 204，後續 me 401 |
| 201 字搜尋 | API 正確 400；前端保留春花舊結果、未顯示錯誤，記 BUG-SEARCH-UI-01，清除篩選後恢復 |

本機使用 `http://localhost:5173` 前台、`http://localhost:5174` 管理、`http://localhost:33317` API。這是同站不同 origin；HTTP fixture 使用非 Secure Cookie，**不代表正式 HTTPS、跨子網域、SameSite／Secure 或 Cloudflare 驗證完成**。首次無 Cookie 的回應交錯由固定整合測試覆蓋；最終 UI 重測沿用既有瀏覽器 context，不冒稱重新建立乾淨瀏覽器。

截圖：[搜尋](evidence/M2_06/search-final.jpg)、[管理](evidence/M2_06/admin-final.jpg)、[登出](evidence/M2_06/logout-final.jpg)、[201 字仍顯示舊結果](evidence/M2_06/search-201-stale.jpg)。HTTP 記錄含 09:39～09:49 的失敗診斷與 14:40 起的最終候選，依時間區分。

## 6. 剩餘缺陷與驗證界線

- **BUG-SEARCH-UI-01（S2，未修）**：201 字搜尋回 400 但保留舊結果、無錯誤提示；200 零筆無空狀態文案。替代操作：修正關鍵字或清除篩選。由 M2-03 處理；是否接受此子版需使用者決定，未代替 UAT 核准。
- 兩項已重現 S1 在本機最終候選修正並回歸通過；未發現本批其他 S0／S1，不推論未知環境沒有風險。
- `npm audit` 2026-10-12 回報 48 個受影響套件（19 high、29 moderate；非 48 個獨立可利用漏洞）。直接依賴涉及 axios、react-router-dom、@tiptap/react、ckeditor5-premium-features；未自動修復或升級。加入 M4-04 依賴影響評估，發布前判斷適用性與修補範圍；不能以 lint/build 通過排除弱點。
- 未執行遠端 CI、實際 R2、正式 MySQL 精確版本核對、正式 HTTPS／跨子網域 Cookie、行動版及多瀏覽器、慢網／離線／5xx／快速切 ID、完整 UAT。M1-05／06 及 M2-03／04 繼續保留。
- 未修改 Cloudflare、Railway、R2、正式資料或環境檔；無部署設定需要隨本次程式修正調整。發佈前仍須重查雲端實際設定。

## 7. 重跑與送驗

後端目錄、Java 17：

```powershell
$env:JAVA_HOME='D:\Paper-art\backend\target\m2-06-tools\jdk-17.0.20.1+1'
.\mvnw.cmd -o spotless:check test
.\mvnw.cmd -o '-Dtest=ArtApiMysqlIT' test
.\mvnw.cmd -o '-Dtest=BrowserVerificationIT' '-Dpaperart.browser=true' test
```

MySQL 入口只對 `127.0.0.1:33316/paperart_m1` 的專用 disposable DB 執行 create-drop；容器配置沿用 [M2-01](M2_01_EXECUTION.md)。缺少快取依賴時才移除 Maven `-o`，不可把資料來源改到正式 DB。

瀏覽器入口先等 `backend/target/browser-verification.ready`，最多開 20 分鐘；完成後建立 `backend/target/browser-verification.stop` 正常結束。`browser-admin`／`browser-local-only` 只為 fixture 帳密。前端以 Node 22 啟動兩個不同埠的 Vite：程序變數 `VITE_API_URL=http://localhost:33317`；前台 `VITE_ADMIN_HOST=127.0.0.1`、埠 5173；管理 `VITE_ADMIN_HOST=localhost`、埠 5174。不寫 `.env`。停掉本次服務並移除專用 MySQL 容器。

前端 CI 對應命令為 `npm ci`、`npm run lint`、`npm run build`，版本 Node 22；不更換現有套件。原始日誌在忽略的 `backend/target`，持久摘要、來源雜湊、HTTP 與畫面證據在本文件旁的 evidence。

剩餘 M2-06 步驟：依既有本機開發／測試授權完成上述工作；取得遠端送驗授權並核對分支觸發後，推送候選分支、建立以 `development` 為目標的草稿 PR，取得相同程式版本的 GitHub `backend`／`frontend` CI 證據。未取得前保持 M2-06 未完成；不合併 `main`、不觸發正式發布，也不重建 staging。
