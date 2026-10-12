# M1 規格確認與診斷紀錄

執行日期：2026-10-08（Asia/Taipei）。執行者：Codex；業務規格／UAT 確認者：使用者。
基準提交：`b4ee38bb366bfecf0192a28670f8c31ddf0cdf7f`。
開始時已有 2026-10-07 的三份規劃文件未提交修改；本次新增診斷與紀錄，未修改正式功能、依賴、CI 或雲端設定。

## 已確認決策

- D-01：使用者負責業務規格與 UAT；Codex 負責本機開發與測試。這不等於 UAT 已完成或授權正式發布。投入時間與正式發布負責人仍待指定。
- D-02：使用者確認關鍵字最多 200 字、每頁最多 100 筆、非法參數回 400、同值排序以 ID 固定順序。其餘搜尋欄位、特殊字元、排序白名單／空值規則仍依規劃表待確認。
- D-03：維持作品已發布，且至少一位公開作者與一個公開分類；未刪除條件沿用。無作者的匯入作品不因本次工作自動公開。
- 隔離安排：先完成本機測試，不重建 staging；MockMvc 不啟動公開 HTTP 服務，R2 用戶端及清理排程以 mock 替換。

## 基準與證據範圍

| 項目 | 執行結果 | 限制／證據 |
|---|---|---|
| 前端 lint | 通過：0 errors、53 warnings | 既有 import／hook 警告，未批次修正 |
| 前端 build | 通過；有大於 500 kB chunk 提示 | 使用既有 node_modules；Node 24.15.0／npm 11.12.1、Vite 8.1.0／React 19.2.7／Axios 1.18.1；本次未 npm ci，不等於 Node 22 乾淨 CI |
| 後端基準 | 格式檢查及原有 11 項測試通過，0 失敗／錯誤／略過 | JDK 18.0.2.1、Maven 3.9.15、test profile／H2 2.3.232；不是 CI Java 17 結果 |
| H2 診斷 | 12 項：5 通過、7 失敗、0 錯誤；兩次執行結果一致 | 第二次移除非法輸入案例的作品資料前置，仍相同；故 500 不依賴該 fixture |
| MySQL 診斷 | 12 項：5 通過、7 失敗、0 錯誤；與 H2 相同，格式檢查通過 | MySQL 9.7.2、utf8mb4_0900_ai_ci；正式只確認 image=mysql:9，不能推定 minor 完全相同 |
| 使用者驗收 | 未執行 | 本次確認業務規格，不代替 UAT |

預設 Java 為 8；本次只在測試程序設定 JAVA_HOME 指向已安裝 JDK 18，未修改系統 Java。
第一次沙箱內測試停在 Spring 啟動後，已中止，不能算測試失敗或通過；改用一般程序權限與 `-Djdk.attach.allowAttachSelf=true` 後完成。未以此實驗單獨確定停滯根因。

原始本機輸出位於 backend/target（受 Git 忽略，重建可能移除）：m1-baseline-final.log、m1-diagnostics.log、m1-diagnostics-minimal.log、m1-mysql-diagnostics.log、surefire-reports。下列摘要與 traceId 保存在本文件，避免只依賴暫存日誌。

MySQL 執行於台北時間 10:30～10:31，Maven 約 41.6 秒、案例本身約 0.03～0.94 秒（另有 Spring 啟動成本）。使用 mysql:9 image digest `sha256:e2bde46db6563855d7177adb5f0b57b9dc663f5a20927a90f4259d3312068497`。
本次暫存容器 paperart-m1-20261008（ID da11627f1ddb709a08fbdf957c0e7ec23fd45520869848734c932f3a4fa2c2f9）已停止並自動移除，查核無同名容器。未掛載既有資料卷；image 保留本機快取。
確認無其他執行中容器後，已停止本次啟動的 Docker Desktop，恢復原先未啟動狀態；未刪除既有 frontend 容器。

## BUG-SEARCH-01：可重現的非法輸入 500

實際執行路徑：Spring Security＋MockMvc→ArtController→既有例外處理；每個搜尋請求均有合法測試 CSRF。
URL 在 MockMvc 內省略 context path，實際部署需加 `/paper/api`。

| 案例 | 最小輸入 | 預期／實際 HTTP | 第二次 H2 traceId |
|---|---|---|---|
| 非數字頁碼 | POST /arts/search?page=abc，body={} | 400／500 | 1f47b108-ac3a-4ce8-a913-ac6f1735d42c |
| 非數字筆數 | POST /arts/search?size=abc，body={} | 400／500 | a3ae9564-d950-4816-ad70-7319bcec26dd |
| 缺 body | POST /arts/search，空 body | 400／500 | 455350f8-d51f-4021-bc9d-e3209f2a5a1e |
| 壞 JSON | POST /arts/search，body 為單一左大括號 | 400／500 | 193437df-a611-4a4e-8cc5-123843a2c549 |
| 錯布林型別 | POST /arts/search，body={"featured":"bad"} | 400／500 | f5115591-b6e4-4f28-a97a-70c10abecaa8 |
| 既有負頁限制 | page=-1，body={} | 400／400 | f4d556f0-9fb2-4653-a891-53f82edf99e6 |
| 既有零筆限制 | size=0，body={} | 400／400 | bf87f8da-5973-4b85-8df5-e09c5adbf1be |
| 新上限規格 | size=101，body={} | 400／200 | 成功回應無錯誤 traceId |
| 新字數規格 | keyword 為 201 個 a | 400／200 | 成功回應無錯誤 traceId |

前五種 500 的回應 code 為 INTERNAL_ERROR；後兩項為尚未實作的新規格，不混稱成既有功能回歸。

MySQL 同一批五種 500 的 traceId 依表順序為：9376069b-e73d-4c94-a532-9dc4cae3813b、baff0b74-8967-4e7b-9d11-cf7100fbcecb、e7024253-310f-4ce3-a960-5962b0851fb6、6d84a3ce-f6af-4f70-b817-3377054b4bab、42facc5d-2ef4-477a-8763-0b16a1749ccb。既有負頁／零筆限制均 400，新上限兩案仍為 200。

### 原因與排除範圍

曾檢驗的方向：例外分類、安全層攔截、查詢／資料庫失敗。
非數字參數的 resolved exception 為 MethodArgumentTypeMismatchException；JSON／body 錯誤為 HttpMessageNotReadableException。
GlobalExceptionHandler 沒有這兩類的專屬處理，落入 Exception 通用處理後回 500。移除作品資料仍可重現；缺 CSRF 的對照案例則回 403 CSRF_INVALID，因此本批輸入的原因已定位在錯誤分類。
這證明目前程式存在可重現的搜尋 500 路徑，不代表所有歷史或有效條件下的 500 都由此造成；仍需原始失敗輸入／traceId 交叉確認。

useWorks 介面不一致仍存在，但在 frontend/src 只找到其定義與匯出，沒有使用端；Works 直接以單一 request 呼叫 searchArts。不能將未使用 hook 當成本次頁面問題根因。

## BUG-DETAIL-01：有效作品偶發找不到仍待重現

本機 fixture：公開 W1～W3 均 200；草稿 W4、已刪除 W5、無作者 W6、有效格式但不存在 UUID 均 404 ART_NOT_FOUND，且含 traceId。
將 W1 唯一作者取消發布後 W1 回 404；W3 尚有另一公開作者，仍回 200。測試沒有包在外層 test transaction，避免遮蔽 Service 交易之外的 lazy loading 問題。
上述公開／不可見／不存在案例在 H2 與 MySQL 9.7.2 均通過；目前未重現「有效且公開的作品偶發 404」。前端 WorkDetail 將各種 fetch 失敗設為 null，再顯示找不到，是已確認的靜態狀態處理缺口；本次未執行瀏覽器錯誤注入或競態測試，不能將它當作歷史事故的已驗證根因。
後續需失敗 URL、發生時間、HTTP 狀態／traceId 與當時作品／作者／分類發布狀態，或隔離瀏覽器重現。

## R2 與安全初查

| 項目 | 已取得證據 | 待處理 |
|---|---|---|
| 現有清理 | 程式每月 5 日台北 03:00 執行非 dry-run；手動 API 預設 dryRun=false | 未查該排程的正式執行日誌，不宣稱已發生搬移或資料損失 |
| 清理範圍 | collectUsedKeys 掃 DB 引用，listAllKeys 掃 bucket；未見依檔案建立時間延後清理 | 尚未儲存的上傳可能落在未引用集合；列 P0 風險驗證，不直接改正式規則 |
| 預覽副作用 | dry-run 不搬物件，但會寫 automation 執行日誌 | 不能當作純唯讀在正式環境任意呼叫；本次未呼叫 |
| DB／R2 一致性 | 搬移是複製到 delete/ 再刪原 key；軟刪除 DB 與物件操作不共用交易 | 需隔離 bucket 測共用圖、失敗補償、還原及併發 |
| 權限 | 本批未登入後台詳情回 401；公開搜尋缺 CSRF 回 403 | 未覆蓋完整權限矩陣／跨網域登入 |

### GitHub 唯讀查核（2026-10-08）

使用 GitHub API 讀取 repo rulesets、ruleset 19758573 及 branches/main/protection，未修改設定。

- Protect main ruleset：active，只包含 refs/heads/main；禁止刪除、禁止 non-fast-forward；要求 PR 與 backend／frontend 兩個 CI；無 bypass actors。
- 該 ruleset 的 required_approving_review_count=0、strict_required_status_checks_policy=false。
- 傳統 main branch protection：required_approving_review_count=1、禁止強推／刪除；enforce_admins=false；required_status_checks=null。
- 需合併兩套規則判讀：有 1 位一般審查要求，也有必要 CI；不能只看 ruleset 的 0 判為缺少審查。strict=false 與管理員保護細節列後續發布查核，不在本次改動。
- 未做實際推送或管理員繞過試驗；上述是設定證據，不是所有角色操作行為測試。

### Railway 唯讀查核（2026-10-08）

- Project paper-art：f4eafc47-6789-4d07-b0c3-090c8edccd94；production：83b5a4de-b82b-4238-b174-34ff9cde8f17。
- 後端 Paper-art：6b39c257-dfb3-44cd-a216-173334e57793，main、/backend、RAILPACK、1 replica、網域 api.paper-cut.org target port 8080。
- 最新部署 fbd12dfb-7bab-4589-955b-3d7333b16333：SUCCESS，2026-10-07 17:28:19 +08:00，提交等於本機基準 b4ee38b。
- MySQL 來源 image=mysql:9、1 replica；未讀 DB 內容或核對容器內精確 minor 版本。
- 無待部署 staged changes。只讀環境及服務結構、變數名稱與部署 metadata，未讀秘密值、未發布。
- Railway 沒有 bucket 不代表 Cloudflare R2 不存在；本次未查 Cloudflare Pages／Access／Rate Limit／R2 lifecycle 或 R2 實際 bucket 設定，均保留證據缺口。

## 歷史診斷入口（M1）

2026-10-12 更新：兩個診斷類別已轉為 [H2／共用回歸](../backend/src/test/java/com/paperart/backend/diagnostics/ArtApiRegressionTests.java) 與 [MySQL 整合回歸](../backend/src/test/java/com/paperart/backend/diagnostics/ArtApiMysqlIT.java)。目前入口與通過結果見 [M2-01 紀錄](M2_01_EXECUTION.md)。下列舊名稱及命令僅保留 M1 歷史；目前工作區請使用新入口，不再預期 7 個失敗。
M1 當時名稱刻意為 *Diagnostics，不進入 Surefire 預設 *Tests 回歸集，必須明確指定 -Dtest；當時預設 11 項通過不代表搜尋已修復。
所有診斷固定使用 test profile、mock R2／排程；fixture 每次重建，不共用正式資料。

PowerShell，在 backend 目錄執行；本次使用的 JDK 路徑如下，其他機器需換為可用且相容的 JDK。

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-18.0.2'
.\mvnw.cmd -o '-DargLine=-Djdk.attach.allowAttachSelf=true' spotless:check test
.\mvnw.cmd -o '-Dtest=ArtApiDiagnostics' '-DargLine=-Djdk.attach.allowAttachSelf=true' test
```

-o 使用本機 Maven cache；新機器需先允許下載依賴。診斷目前預期 exit 1，應看到 12 tests、7 failures、0 errors；若是環境啟動錯誤，不能當成成功重現。

MySQL 只允許本機暫存容器，固定 127.0.0.1:33316／paperart_m1，會 create-drop；先確認該埠沒有其他資料庫，禁止改連正式服務。以下帳密為測試專用字串。

```powershell
docker run --rm --detach --name paperart-m1-20261008 --label paperart.scope=m1-diagnostics --publish 127.0.0.1:33316:3306 --env MYSQL_DATABASE=paperart_m1 --env MYSQL_USER=m1 --env MYSQL_PASSWORD=m1-local-only --env MYSQL_ROOT_PASSWORD=m1-root-local-only mysql:9
docker exec paperart-m1-20261008 mysqladmin ping -h 127.0.0.1 -um1 -pm1-local-only
.\mvnw.cmd -o '-Dtest=ArtApiMysqlDiagnostics' '-DargLine=-Djdk.attach.allowAttachSelf=true' test
docker stop paperart-m1-20261008
```

只在 ping 回 mysqld is alive 後執行 MySQL 診斷。容器帶 --rm 且未掛既有 volume，stop 後容器與其匿名資料卷移除；下載 image 仍保留本機快取。

## M1 當時的下一步與未完成範圍

1. M2 先處理已重現的兩類請求解析例外及已確認的 200 字／100 筆上限，將診斷轉成回歸案例；不更換框架或新增搜尋 API。
2. 詳情頁的網路／5xx／404 區分與請求競態需瀏覽器重現及驗證；歷史有效作品偶發找不到維持追蹤。
3. 排序同值 ID 規格已確認，尚未實作或驗證；其餘 D-02、D-04～07 未定部分保持待確認。
4. MySQL 的精確正式版本、Cloudflare 設定、真實 R2、跨網域登入與真人 UAT 未完成，不標發布就緒。
5. R2 未儲存上傳與引用競態列 P0 風險驗證；正式清理、保留規則或永久刪除不因本次診斷而授權。

M1 已有可操作的搜尋重現、基準與下一步修改依據；不將整個 M1 或 R1 標記完成，尚待上述環境／業務／瀏覽器項目。
