# M2-05 共用認證與權限回歸紀錄

執行日期：2026-10-12；執行者：Codex。基準提交：`b4ee38bb366bfecf0192a28670f8c31ddf0cdf7f`，結果對應含 M2-01 的未提交工作區差異；未部署或 UAT。

## 結果

M2-05 本批本機回歸完成。完整後端 **62 項通過，0 失敗、0 錯誤、0 略過**，Spotless check 通過。未將此結果標成 QA-06～10 的全部跨環境驗收。

| 狀態 | 本批結果 |
|---|---|
| 實作 | 修正 CSRF 提早拒絕時缺少 traceId；新增／擴充安全及管理 API 測試 |
| 測試 | AuthSecurityIntegrationTests 23、LoginAttemptServiceTests 4、ManagementSecurityIntegrationTests 7；其餘 28 項含 M2-01 搜尋 22、系統錯誤 1 及原有其他服務 5，總計 62 |
| 部署 | 未提交、推送、發布或修改雲端／環境變數 |
| 驗收 | 使用者 UAT、瀏覽器跨網域與真實 R2 尚未執行；下一步 M2-06 同版驗證 |

環境：Windows、JDK 18.0.2.1（pom 編譯目標 17）、Maven 3.9.15、Spring Boot 3.5.3、H2 2.3.232。本批未啟動 Docker／MySQL；M2-01 的 MySQL 22 項是前批證據，不算本批重新通過。

## 影響分析與修正

M2-01 改動共用 MVC 例外處理，會影響登入、管理 JSON／multipart JSON 及參數解析，因此本批除了 QA-06／07，也抽測 QA-08 CRUD、QA-09 上傳、QA-10 匯入。沿用 TODO 已指定的 API 與 LoginAttemptService 公開介面；不以私有方法或模擬內部 Service 取代實際流程。

新發現的缺陷：有效公開登入端點在缺 CSRF 時回 403／CSRF_INVALID，但錯誤 body 缺少 traceId，回應也沒有 X-Trace-Id。原因是 RequestTraceFilter 原本排在 CSRF 過濾器之後。

最小修正位於 [SecurityConfig](../backend/src/main/java/com/paperart/backend/config/SecurityConfig.java)：

- RequestTraceFilter 移到 CorsFilter 前，涵蓋 CORS／CSRF 提早結束的請求。
- JwtAuthenticationFilter 維持在 UsernamePasswordAuthenticationFilter 前，避免跟著追蹤過濾器提前到 CORS／CSRF 之前。
- 不改授權 matcher、Cookie／JWT 規則、CORS 白名單或登入限制。

修正前 `loginRequiresCsrfToken` 重現 `No value at JSON path "$.traceId"`；修正後認證基本 5 項、擴充認證 23 項及完整 62 項全部通過。CORS 拒絕仍沿用 Spring 的 403 格式，只新增 X-Trace-Id；CSRF／認證／MVC 錯誤依既有 ApiError 回應。

## 案例與驗證界線

| 對應 | 已執行 |
|---|---|
| QA-06 登入／登出 | 真實 GET /auth/csrf Cookie＋header →登入→/auth/me→登出；JWT HttpOnly、Secure、Path=/、SameSite=Lax，JSON 不回 token；登出刪 Cookie，客戶端移除 Cookie 後受保護端點回 401 |
| QA-06 無效身分 | 缺 Cookie、格式錯誤、逾期、錯誤簽章；錯密碼、不存在／停用帳號均為 401，不回認證 Cookie；撤銷權限及停用帳號對已發 Cookie 生效 |
| QA-06 授權 | 透過真實 API 建 ADMIN、ART_MANAGE、AUTHOR_MANAGE、CATEGORY_MANAGE、無權限帳號，再實際登入；驗證作品／作者／分類後台、users、roles 與跨模組 403 |
| QA-06 高風險端點 | 非 ADMIN 清理端點回 403；ADMIN 以非法 dryRun 測解析 400，沒有執行任何清理；S3 無呼叫 |
| QA-06 CSRF／CORS | 缺少／錯誤 CSRF 拒絕；有效 CSRF 下未登入寫入 401；允許 Origin 預檢及帶 credentials／暴露 trace header；禁止 Origin、方法、header 預檢及禁止 Origin 實際帶 Cookie 請求均被拒絕 |
| QA-07 限制 | API 連續 5 次錯誤各回 401，第 6 次即使密碼正確也回 429／LOGIN_RATE_LIMITED；不同帳號或來源 IP 不互鎖；成功登入清除先前失敗次數 |
| QA-07 到期 | 使用可控制 Clock 驗證從第 5 次失敗起算 15 分鐘，最後 1 秒仍封鎖、到期解除；超出累計視窗的失敗不累加，解除後可重新計數。到期在服務層驗證，沒有讓 API 實等 15 分鐘 |
| QA-08 抽樣 | 真實作者／分類／作品建立、修改、取消發布、軟刪除與重新讀取；正常完整表單可儲存；管理壞 JSON 在授權後回 400，越權時先回 403 |
| QA-09 抽樣 | 上傳缺 CSRF、未登入、無權限被拒絕；允許角色取得儲存 key／URL；模擬 S3 失敗維持 500 且回應不洩漏內部例外 |
| QA-10 抽樣 | 記憶體產生 Excel，驗證匯入 CSRF／角色權限、成功 1 筆、後台讀回、重送跳過 1 筆；缺作者作品維持公開搜尋 0 筆及詳情 404 |

登入／管理測試使用獨立 H2 `paperart_m2_security`／`paperart_m2_management`、test profile、測試帳號。正式 Controller、Service、Repository、JWT 與密碼驗證均實際執行；S3Client 與排程觸發以 mock 隔離。沒有外層測試交易掩蓋 HTTP／Service 邊界。
認證類別逐案確認 MDC 已清除且 S3 未呼叫。管理測試的上傳只驗證模擬儲存邊界與回應，沒有證明真實 R2 可讀或 DB／R2 補償完整。

Cookie 與 CORS 是 MockMvc 的伺服器回應驗證，不能取代瀏覽器對 Secure／SameSite／跨網域 Cookie 的實際處理。登出依既有 stateless 設計清除客戶端 Cookie，本批沒有加入伺服器端 JWT 撤銷機制，不宣稱已複製 token 的重放也會失效。CF-Connecting-IP 信任邊界、雲端限制及代理設定仍由 M4-04／QA-14 查核。

## 測試調整與保留缺口

- 最初讀取登出 Set-Cookie 的第一筆時誤讀到 XSRF Cookie，改為定位 PAPERART_SESSION；這是測試修正，不是產品缺陷。
- 混用 Spring 測試的 csrf() 輔助與真實 Cookie，會干擾同一測試 context 的 CSRF repository；本批安全測試統一從 /auth/csrf 取得 Cookie，不混用假 token。
- 正常 CRUD 測試起初漏送作品 featured／rentable、作者更新 sortOrder，分別得到 409 與 DB NOT NULL 錯誤。已依前端既有完整表單補齊欄位，未修改 CRUD 預設值；「缺必要欄位應如何驗證／回應」留 M4-01，分類更新 sortOrder 亦需一併核對。
- 日誌中的 S3 例外與未知系統例外為故意注入的失敗，對外 500 已驗證不洩漏；另有既有 PageImpl／dialect／commons-logging 警告，本批未更換依賴。

## 可重跑與 CI

在 backend 目錄使用相容 JDK；本機實際指令：

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-18.0.2'
.\mvnw.cmd -o '-Dtest=AuthSecurityIntegrationTests,LoginAttemptServiceTests,ManagementSecurityIntegrationTests' '-DargLine=-Djdk.attach.allowAttachSelf=true' spotless:check test
.\mvnw.cmd -o '-DargLine=-Djdk.attach.allowAttachSelf=true' spotless:check test
```

第一個指令是本批 34 項重跑入口；第二個完整 62 項已於本批執行通過。新機器需先下載依賴，`-o` 僅適用已有快取。
三個類別均符合既有 Maven 預設測試命名，CI 的 Java 17 `sh mvnw spotless:check test` 會納入；本次未推送／執行遠端 CI，不能將 JDK 18 的結果當作 Java 17 通過。

本機日誌（受 Git 忽略）：`backend/target/m2-05-csrf-red.log`、`m2-05-csrf-green.log`、`m2-05-security.log`、`m2-05-management.log`、`m2-05-management-final.log`、`m2-05-full.log` 及 Surefire 報告。日誌可能被重建清除，摘要以本文件保留。

## 完整程式碼與版本識別

SHA-256 是本次已測試檔案位元組識別；換行轉換可能改變雜湊。M2-01 的 7 個原始碼／測試雜湊仍保留於 [前批紀錄](M2_01_EXECUTION.md)。

| 檔案 | SHA-256 |
|---|---|
| [SecurityConfig.java](../backend/src/main/java/com/paperart/backend/config/SecurityConfig.java) | 7444CBA56DC27B491967ADCAFF3D25CEA103BA644029A5E54D18FA75312860C4 |
| [AuthSecurityIntegrationTests.java](../backend/src/test/java/com/paperart/backend/security/AuthSecurityIntegrationTests.java) | A80259ED617252A154FA2199C3D3F387EC125367281CFFCE66F419C2EA80C9FF |
| [ManagementSecurityIntegrationTests.java](../backend/src/test/java/com/paperart/backend/security/ManagementSecurityIntegrationTests.java) | E636D23AFBBE866CE19A1600A13E498AD4442BDB6CA5C726F5CDF7C4C789D8DE |
| [LoginAttemptServiceTests.java](../backend/src/test/java/com/paperart/backend/service/LoginAttemptServiceTests.java) | EF3F7DE294C0999467F361F6E086BCD1CE975650AF32AC09BC64D3F5ED733672 |

## 下一步

M2-06：固定候選範圍與提交、審查、Node 22／Java 17 CI，並安排同版必要 MySQL／瀏覽器證據；本機通過不等於 R1 或發布就緒。M1-05 詳情重現與 M1-06 清理風險仍待辦。本次不需調整 Railway、Cloudflare Pages／R2 或環境變數。
