# PaperArt 開發流程與驗收規劃

規劃日期：2026-10-07；決策與執行進度更新：2026-10-13。程式盤點基準：`b4ee38bb366bfecf0192a28670f8c31ddf0cdf7f`。

2026-10-07 交付為規劃文件與待辦。2026-10-08 已開始 M1：規格確認、隔離診斷與雲端唯讀查核，見 [M1 執行紀錄](M1_EXECUTION.md)；未修改正式功能或發布。「現況」除另註實測外指原始碼查核；「建議」為後續方案；「待確認」不代表使用者已同意。
2026-10-12 已完成 M2-01 本機搜尋修正與 H2／隔離 MySQL 回歸，見 [M2-01 紀錄](M2_01_EXECUTION.md)；未部署或 UAT。上方「未修改正式功能」指 M1 當次範圍。
執行狀態見 [CURRENT_STATUS.md](CURRENT_STATUS.md)，工作順序見 [TODO.md](TODO.md)，發布操作見 [DEPLOYMENT.md](DEPLOYMENT.md)。
同日後續完成 M2-05 本機安全／管理回歸與 CSRF 追蹤修正，完整後端 62 項通過；範圍與未覆蓋環境見 [M2-05 紀錄](M2_05_EXECUTION.md)。
2026-10-13 M2-06 已完成同候選本機審查、Java 17 的 65 項、MySQL 22 項、Node 22 及瀏覽器抽樣；修正兩項實測 CSRF 缺陷。遠端 CI、UAT 與發布未完成，詳見 [M2-06 紀錄](M2_06_EXECUTION.md)。

## 1. 產品目標與版本範圍

PaperArt 是剪紙藝術作品展示平台。目標使用者為瀏覽作品的訪客、維護內容的管理者及管理權限與資料的 ADMIN；真人負責人依 D-01 指派。
維持 React、React Router、Axios、Spring Boot、Spring Security、MySQL、Cloudflare R2 既有架構，優先修改及重用現有程式。

| 規劃版本 | 內容 | 成功條件 |
|---|---|---|
| R1 核心穩定性（P0） | 搜尋／詳情重現、輸入契約、Loading／Error／Empty、返回列表、請求競態、安全與資料風險初查 | 適用 QA-01～03、05～07、11～13 通過；風險無未處理阻斷；必要整合與 UAT 完成 |
| R2 篩選與體驗（P1） | Tag、Featured、Rentable、Sort、URL 還原、Drawer、行動版 | QA-04、05、11、12 通過並重跑 R1 核心回歸 |
| R3 管理與維運（P1） | 管理、上傳／匯入、雲端安全、schema 遷移、備份、回收站及 R2 清理治理 | 各子項 QA-06～10、14～16 與獨立發布關卡通過；可分批發布 |
| P2 後續 | 非核心視覺改善 | 個別建立需求，不阻塞 R1 |

建議先交付 R1，再依相依關係處理 R2／R3。若確認越權、資料毀損或現行清理誤搬移風險，立即提高為 P0，不等待 R3。
R1 不宣稱補齊所有管理功能；若改動共用 Axios、安全、資料關聯或上傳服務，必須加入受影響的 QA-08～10。
R1～R3 是規劃名稱，不代表 Git tag、已核准範圍或發布承諾。

排除：原生 App、新商業／租借交易流程、框架更換、全面重構、未經確認重建 staging、正式環境寫入／負載測試、多 instance 或 Redis 基礎設施擴充。

## 2. 十二階段與關卡

| 階段 | PaperArt 產出 | 完成條件 |
|---|---|---|
| 1 產品目標 | 第 1 節、D-01 | 使用者、目標及範圍經產品負責人確認 |
| 2 需求分析 | REQ-01～12、D-02～07 | 正常／例外流程、權限及驗收條件定案 |
| 3 版本範圍 | R1～R3、TODO 相依表 | 本版納入／排除、優先級與負責人明確 |
| 4 UX 流程 | 第 5 節 | 瀏覽、管理、空資料、失敗及恢復流程齊全 |
| 5 UI 規範 | 沿用 Layout、Pagination、Works Drawer 與 CSS | 手機、鍵盤與狀態呈現一致 |
| 6 技術設計 | 第 4 節 API、資料與權限 | 契約、相容性及副作用明確 |
| 7 工程基礎 | 第 6 節 CI、版本、隔離資源 | 執行方式可重現，不連入正式寫入資源 |
| 8 開發 | TODO 逐項實作、必要測試及審查 | 同一提交具實作、文件與測試證據 |
| 9 QA | 第 7 節 fixture、QA-01～16、缺陷紀錄 | 適用案例通過，阻斷缺陷清零 |
| 10 UAT | 訪客／管理者腳本與簽核 | 指定驗收者記錄日期、結果與未解問題 |
| 11 發布 | DEPLOYMENT 檢查、備份、回復及授權 | 相同候選版本通過發布就緒關卡 |
| 12 維運 | 第 8 節觀察、告警、回饋 | 有處理人、觀察結果及下一輪待辦 |

三個關卡依序為「需求確認→開發完成→發布就緒」。規劃文件完成不代表任何關卡自動通過。

## 3. 原始碼盤點與需求

### 3.1 靜態查核結果

Java 檔案位於 `backend/src/main/java/com/paperart/backend/` 對應分層，其餘路徑相對於專案根目錄。

| 程式依據 | 現況 | 規劃影響 |
|---|---|---|
| `frontend/src/pages/Works.jsx`、`frontend/src/api/artApi.js` | 頁面只有關鍵字／分類／作者／分頁；API 封裝傳送 featured、rentable、sort，但沒有 tagIds | 重用搜尋 API，補 UI→URL→API 串接 |
| `frontend/src/hooks/useWorks.js` | 以三個參數呼叫只收單一 request 的 searchArts | 核對使用端及實際請求，不直接當成歷史 500 根因 |
| `Works.jsx`、`WorkDetail.jsx` | 列表失敗只記 console；詳情各種失敗均變成找不到；未見過期請求防護 | 補狀態區分、重試及慢回應案例 |
| `ArtSearchRequest.java`、`ArtServiceImpl.java` | 後端有 Tag／布林篩選與排序；DTO 排序註解與實作不一致 | 先列現況契約，再確認目標 |
| `ArtServiceImpl.java` | 公開作品需未刪除、已發布且有公開作者／分類；作品匯入未指定作者 | 匯入作品可能不出現在前台；先確認業務規則，不直接放寬公開權限 |
| `SecurityConfig.java`、`frontend/src/api/api.js` | 公開 POST 搜尋仍經 CSRF；公開詳情 matcher 限制 ID 樣式 | 搜尋重現帶 CSRF；有效格式但不存在 ID 與錯誤格式分開測 |
| `TagServiceImpl.java`、`TagRepository.java`、controller 目錄 | 有 Tag Service／資料層，未找到 TagController | 不能沿用歷史「Tag CRUD 完成」；先決定選項來源與管理範圍 |
| `R2CleanupScheduler.java`、`R2CleanupController.java` | 每月 5 日台北時間 03:00 排程；手動 dryRun 預設 false | 已有清理行為，列 P0 初查，不當成全新功能 |
| `R2CleanupServiceImpl.java`、`FileUploadServiceImpl.java` | 非 dry-run 複製到 delete/ 並刪原 key；dry-run 也寫 DB 日誌 | 空測試 DB 不可配正式 bucket；需引用、競態及還原驗證 |
| `application-prod.properties`、`backend/pom.xml` | ddl-auto=update；未列 Flyway 依賴 | 先核對實際 schema 與還原，再規劃 baseline |
| CI、`frontend/package.json`、`docker-compose.yml` | CI Node 22／Java 17；前端只有 lint/build；compose 只有 Node 20 前端 | compose 不是完整隔離環境；build 不等於行為驗收 |

上述為原始碼事實，未證明線上缺陷、排程實際執行或雲端設定。

### 3.2 需求與驗收追蹤

共同前置：固定提交、隔離資料、相關決策已確認。開發者負責設計／實作／QA；產品負責人負責業務驗收；發布負責人負責環境與維運，真人指派見 D-01。

| 編號／優先級／版本 | 角色、目的與流程 | 驗收條件 | 相依、影響及排除 |
|---|---|---|---|
| REQ-01／P0／R1 | 訪客輸入條件→取得正確分頁結果 | QA-01／02／13；預期輸入錯誤不回非預期 500 | D-02／03；搜尋 DTO／Controller／Service／錯誤處理；不新增搜尋 API |
| REQ-02／P0／R1 | 訪客開作品→辨識可見／不存在／連線失敗 | QA-03／11；有效作品 200，不可見／不存在 404；失敗可重試 | REQ-01 公開規則；WorkDetail／ArtService；不放寬權限 |
| REQ-03／P0／R1 | 訪客等待或失敗→重試／清除／返回 | QA-11／13；狀態互斥，舊回應不覆蓋新條件 | REQ-01／02；pages／hooks；不全面重構 |
| REQ-04／P1／R2 | 訪客選 Tag／精選／可租借／排序→分享 URL | QA-04；UI、URL、API、結果一致且排序穩定 | D-02／04、REQ-01／05；既有搜尋與 UI；不新增租借交易 |
| REQ-05／P0→P1／R1→R2 | 訪客列表→詳情→返回、重整或貼 URL | QA-05／13；條件、頁碼與返回捲動還原 | R1 既有欄位、R2 新篩選；分享 URL 不需保存捲動 |
| REQ-06／P0 回歸、P1 查核／R1→R3 | 各角色登入及依權限操作 | QA-06／07／14；Cookie、CSRF、CORS、限制與越權正確 | 既有安全元件；雲端需可用權限；不新增多 instance |
| REQ-07／P1／R3 | 管理者建立→編輯→發布／取消發布→刪除 | QA-08；前台依公開關聯規則反映，無權不能寫入 | D-03、REQ-06；既有 CRUD；Tag 管理待 D-04 |
| REQ-08／P1／R3 | 管理者上傳／匯入→核對結果 | QA-09／10；回應與實存相符，無未說明副作用 | D-05、REQ-06／07；MySQL／R2／匯入；不假設跨服務原子交易 |
| REQ-09／P1／R3 | 維運者盤點 schema→備份→隔離遷移→還原 | QA-15；數量／關聯／抽樣雜湊、相容性及還原驗證 | D-06、實際 schema；Flyway 引入另確認實作範圍 |
| REQ-10／P0 初查、P1 改善／R1→R3 | ADMIN 看清單→確認保留規則→清理／還原 | QA-16；引用中及保留期內檔案不誤刪，操作可追蹤 | D-06、REQ-09；DB＋R2；軟刪除不等於完整回收站 |
| REQ-11／P1／R2 | 訪客／管理者用桌機與手機完成主要流程 | QA-12；無遮擋，Drawer、鍵盤及捲動可操作 | D-07、REQ-03／04；沿用 CSS／元件；美化列 P2 |
| REQ-12／各版必要 | 驗收者 UAT→發布者核對→觀察回饋 | 同版通過第 8 節發布關卡與觀察 | 本版需求與 QA；不自動發布或重建 staging |

## 4. API、資料與權限設計

### 4.1 搜尋與詳情契約

共用路徑 `/paper/api`；沿用 `POST /arts/search?page=0&size=12`。JSON body：keyword、authorIds、categoryIds、tagIds、rentable、featured、sort 可省略。
沿用 Spring Page 回應：前端讀 content／totalPages，驗收另核對 totalElements／number／size。列表 URL page 從 1 起算，API 從 0 起算，轉換只做一次。

| 項目 | 程式現況 | 建議目標，待 D-02／03／04 |
|---|---|---|
| keyword | trim、不分大小寫，LIKE 比對 title、description、artNumber、material、color、technique、creationPeriod、artworkType、remarks；%／_ 未明確跳脫 | 沿用欄位及包含比對；空白視無條件；%／_ 當一般文字；長度 0～200，超過 400 |
| 多選 | 群內 IN、跨群 AND、distinct 去重 | 沿用；字串 UUID 不轉數字；重複 ID 正規化；格式錯 400、有效但不存在 ID 回空結果 |
| 分頁 | 預設 page=0、size=12，由 PageRequest 建立 | page≥0、1≤size≤100；非數字／超限 400；超總頁回 200 空 content，UI 可回第一頁 |
| 布林 | null／省略不限，true／false 均可篩選 | API 保留三態；UI 建議「全部／是／否」，清除回全部 |
| sort | newest、oldest、yearDesc、yearAsc、titleAsc、titleDesc；空值及其他值用 sortOrder 升冪 | 白名單上述值＋sortOrder；未知值 400；主排序後 id 升冪，空 year／title 置後；MySQL 驗證 |
| 公開資格 | 未刪除且已發布，至少一個未刪除且已發布的作者及分類 | 預設保留；無作者匯入作品如何處理見 D-03 |
| 詳情 | GET /arts/{id}；不可見／不存在 ART_NOT_FOUND 404；非法格式可能先落入安全規則 | 有效格式不存在 ID 驗收 404；非法格式建議 400，須評估 matcher，不可全域放寬後台路由 |

URL 沿用 search、category、author、page，新增 tag（可重複）、featured、rentable、sort；省略預設值，API 對應 tagIds 等欄位。
非法 URL 顯示參數錯誤並可重設，不送出 NaN／負頁碼／undefined；後端仍獨立驗證。未知 URL 參數不影響受支援條件；契約變更須測舊 URL 相容性。
錯誤沿用 ApiError：timestamp、status、code、message、path、traceId，details 非空才有。400 使用 INVALID_REQUEST／VALIDATION_FAILED，404 使用 ART_NOT_FOUND；不向前端傳秘密、堆疊或 SQL。
搜尋重現先 GET /auth/csrf、保留 Cookie，POST 帶 X-XSRF-TOKEN；缺 CSRF 的 403 不記成搜尋 500。

### 4.2 管理 API 與權限

| 對象 | 既有行為 | 驗收重點 |
|---|---|---|
| 訪客 | GET 公開資料、POST /arts/search | 只見公開內容；不可讀後台草稿；搜尋仍需 CSRF |
| 內容管理者 | /arts/admin、/authors/admin、/categories/admin 與相應寫入 API | ADMIN 或 ART_MANAGE／AUTHOR_MANAGE／CATEGORY_MANAGE；測跨模組越權 |
| 上傳 | POST /upload/{folder}，image multipart；作品寫入 data＋thumbnail multipart | ADMIN 或既有允許的管理權限；另核對 folder／key 物件權限 |
| 匯入 | POST /arts/import，file multipart | ADMIN 或 ART_MANAGE；核對格式、計數與交易結果 |
| ADMIN | /users/**、/roles/**、/admin/r2/** | 非 ADMIN 禁止；清理預覽明確指定 dryRun=true，省略會真的搬移 |
| 認證 | POST /auth/login、/auth/logout；GET /auth/me、/auth/csrf | JWT Cookie HttpOnly；有效 CSRF 下未登入 401、權限不足 403；CSRF 先失敗則 403 CSRF_INVALID |

Tag 選項不從當頁作品反推，避免其他頁標籤不可選。先查是否有可重用端點；沒有時由 D-04 決定最小公開選項端點，沿用 TagService／Repository，另定契約，不順便新增整套 Tag 管理。

### 4.3 資料與副作用

- 作品對作者／分類／Tag 為多對多；published／deleted 與關聯可見性同時測列表、詳情及數量，避免重複、漏列或列表與詳情不一致。
- 作品匯入從每張工作表第 3 列開始，缺編號／標題或既存編號略過，回 createdCount／skippedCount／failedCount；逐列 catch 與外層交易不保證部分成功，需 MySQL 錯誤案例查核提交結果。
- 刪除作品先處理縮圖再軟刪 DB；R2／DB 不共享交易。測搬移失敗、DB 提交失敗、共用圖片與重試，保留補償／復原方式。
- 清理排除 delete/、editor/、editor-images/、ckeditor/；需盤點漏掉的引用、URL 編碼、尚未儲存的上傳與競態。dry-run 寫 DB 執行日誌，不屬於完全唯讀。
- Flyway、回收站及永久刪除為後續設計；本次不新增 migration、依賴、排程、bucket 規則或秘密值。

## 5. UX 與 UI 規則

1. 列表：讀 URL→驗證→Loading→成功作品／分頁；200 零筆顯示無結果及清除；失敗顯示錯誤及重試，不拿舊結果或空資料冒充成功。
2. 搜尋／篩選：新條件回第 1 頁；移除單一條件只移除該條件；全部清除回預設。目前移除關鍵字會清掉其他條件，納入 QA-05。
3. Drawer：開啟複製已套用條件；取消不改 URL；套用才更新；清除勾選只改草稿。測 Escape、焦點移入／返回及手機捲動。
4. 詳情：Loading、200、404、403、網路／5xx 分開顯示；提供重試／返回；切換 ID 後舊回應不覆蓋新作品。
5. 返回：沿用 from／scrollY；還原 URL，內容就緒後恢復捲動。直開詳情無來源時回 /works；瀏覽器上一頁／下一頁也要測。
6. 管理：提交期間防重送；失敗保留輸入；成功提示與儲存／列表一致；權限不足不自動重送寫入。

優先修既有 pages／hooks／api／CSS，有實際重複才抽共用狀態元件。已有 ErrorPage 須核對接線，不以檔案存在推定錯誤流程完成。

## 6. 工程基礎與隔離驗證

推薦本機＋CI 先行：成本低，能做核心回歸；限制是不能代表 Cloudflare、Railway、跨網域 Cookie 及真實 R2。
重建 staging 可補雲端整合，但需費用與維護且須另經使用者確認。維持下線；必要雲端案例未驗證時，發布關卡仍未通過。

| 層級 | 執行安排 | 證據與限制 |
|---|---|---|
| 靜態／建置 | frontend Node 22：npm ci、npm run lint、npm run build；backend Java 17、Maven wrapper | 記提交／工具版本／退出碼；Windows 用 mvnw.cmd spotless:check test，CI 用 sh mvnw spotless:check test |
| 後端測試 | 沿用 JUnit／Spring、test profile | 找到 6 個測試類別、11 個 @Test；H2 不等於 MySQL／R2／瀏覽器驗證 |
| MySQL 整合 | 獨立本機 DB／帳號，可重建 fixture；版本先比對正式設定 | 尚無完整後端＋MySQL compose；禁止連正式 DB seed／reset／匯入 |
| 前端行為 | 可重現瀏覽器案例；若需增加測試工具，另說明依賴與範圍 | 現無 test script；lint/build 不能取代 QA-05／11～13 |
| 儲存 | 單元 mock；整合用專用測試 bucket／憑證 | bucket 級清理列舉所有 key，只有 prefix 不足以隔離；資源未隔離前不啟動會清理的完整服務 |
| 雲端整合 | 經確認的隔離環境測網域、HTTPS、Cookie、CORS、Access、R2 | 記錄前後台／API 來源及版本；本機通過不補填雲端結果 |

預檢 MYSQL*、R2_*、JWT_SECRET、ADMIN_*、CORS_ALLOWED_ORIGINS、SPRING_PROFILES_ACTIVE、VITE_API_URL、VITE_ADMIN_HOST、VITE_ADMIN_BASE_PATH 的環境與用途，只記名稱，不存秘密值。
dev profile 不等於隔離保證，連線可被變數覆寫；啟動前核對 DB、bucket、排程與帳號。
後續開發用獨立 codex/ 分支、PR 及既有 CI；本次僅更新文件，未建立分支／PR。

## 7. QA、資料與 UAT

### 7.1 固定測試資料（尚未建立）

僅在隔離環境建立。A／B、C1／C2、T1／T2 分別為已發布且未刪除的作者、分類、Tag。W1～W6 為別名，記錄實際 UUID，固定 UUID 字典順序 W1＜W2＜W3。
未註明者已發布且未刪除；description 與其他搜尋文字欄位初始空值，圖片用隔離資源。

| 別名 | title／編號 | 作者／分類／Tag | featured／rentable | sortOrder／year／createdAt |
|---|---|---|---|---|
| W1 | 春花／QA-001 | A／C1／T1 | true／true | 10／2020／2026-01-01T00:00:00Z |
| W2 | 春鳥／QA-002 | B／C2／T2 | false／true | 20／2021／2026-01-02T00:00:00Z |
| W3 | 山景／QA-003 | A、B／C1、C2／T1、T2 | true／false | 20／2021／2026-01-02T00:00:00Z |
| W4 | 草稿／QA-004 | A／C1／T1；作品 published=false | false／true | 30／2022／2026-01-03T00:00:00Z |
| W5 | 已刪除／QA-005 | A／C1／T1；作品 deleted=true | false／true | 40／2022／2026-01-04T00:00:00Z |
| W6 | 未配作者／QA-006 | 無／C1／無 | false／true | 50／2023／2026-01-05T00:00:00Z |

公開基準 W1、W2、W3；size=2 時 totalElements=3、totalPages=2；預設排序頁 0=[W1,W2]、頁 1=[W3]（同值順序依 D-02）。
每案獨立重建，測單欄搜尋、空 year／title、特殊字元、關聯發布等情境時才改副本。
帳號至少含 ADMIN、僅 ART_MANAGE、僅 AUTHOR_MANAGE、無相應管理權限及未登入；不複用正式帳密。

### 7.2 驗收案例

下表為完整驗收目標。2026-10-08 已執行部分 API／安全診斷，案例與結果見 [M1 執行紀錄](M1_EXECUTION.md)；尚未完整通過任何跨層驗收組，未涵蓋的子情境仍為未執行。待確認規格可先準備，不可先標業務驗收通過。API 案例先取得所需 CSRF；寫入皆在隔離副本。

| 編號／REQ | 輸入與步驟 | 明確預期 | 層級 |
|---|---|---|---|
| QA-01／01 | 搜尋 {}、keyword=春、不存在詞；其他搜尋欄逐一放唯一值查詢 | 200，依序 3 筆、W1/W2、0 筆；單欄只回指定作品；數量一致 | API＋MySQL＋瀏覽器 |
| QA-02／01 | page=-1／abc；size=0／101；空 body、壞 JSON、錯誤型別、未知 sort、201 字、非法 ID；另測空白／%／_ | 非法輸入 400 ApiError／traceId；空白無條件；%／_ 依 D-02 當文字；不得 500 | API＋MySQL |
| QA-03／02 | 開 W1、W4、W5、W6、有效格式不存在 UUID、非法 ID；將 W1 唯一作者／分類改不可公開 | W1 初始 200；W4/W5/W6／不存在 404；關聯改後 W1 不列出且詳情 404；非法 ID 依 D-02 | API＋瀏覽器 |
| QA-04／04 | T1、featured=true／false、rentable=true／false、A＋C2＋T1、七種 sort、布林清除、群內多選 | 依序 W1/W3、W1/W3／W2、W1/W2／W3、W3；群內 OR／跨群 AND；去重且穩定排序 | API＋MySQL＋瀏覽器 |
| QA-05／05 | 春＋C1 移除 keyword；套用→分頁→詳情→返回；重整／貼 URL／上一頁／下一頁；Drawer 取消；清除 | 移除 keyword 保留 C1；新條件回頁 1；UI／URL／API 一致；返回恢復；取消不套用；清除回預設 | 瀏覽器 |
| QA-06／06 | 各角色登入→/me→授權／越權操作→登出；缺 CSRF、逾期 Cookie、允許／禁止 Origin | 有效 CSRF 下未登入保護 API 401、越權 403；缺 CSRF 403；JWT HttpOnly；登出失效；禁止 Origin 無跨域讀取許可 | 安全測試＋跨網域整合 |
| QA-07／06 | 同帳號＋IP 錯 5 次→再試→封鎖 15 分鐘後試；成功清計數；不同帳號／IP | 第 5 次失敗後後續請求被限制；到期解除；互不誤鎖；記實際 HTTP code；隔離／可控時間測試 | 服務測試＋隔離 API |
| QA-08／07 | 建作者／分類／作品→改→發布／取消→刪；重複／缺值／失效關聯；跨模組帳號 | 持久化及稽核正確、前台依 D-03；失敗保留輸入且無未預期寫入；Tag 依 D-04 | API＋MySQL＋瀏覽器 |
| QA-09／08 | 有效小圖、設定上限＋1 byte、偽裝非圖、R2 失敗、DB 失敗；讀圖與重試 | 成功 key／URL 可讀；超限 413 FILE_TOO_LARGE；其他依核定契約，無未記錄孤立物件／越權 | 隔離 MySQL＋R2＋瀏覽器 |
| QA-10／08 | 第 3 列起有效新作品、重複編號、空標題各一筆→匯入→重送；另測壞檔／DB 錯誤 | 正常新增 1、略過 2；重送新增 0、略過 3；實存與計數一致；副作用依 D-05、可見性依 D-03 | 隔離 MySQL＋瀏覽器 |
| QA-11／02／03 | 慢網、離線、500、200 空結果、404→重試／返回 | Loading／Error／Empty／Not found 可分辨；錯誤不當零筆；恢復後可重試且保留條件 | 瀏覽器 |
| QA-12／11 | D-07 瀏覽器；390×844、768×1024、1440×900；鍵盤列表／Drawer／詳情／管理表單 | 無水平溢出／遮擋；焦點可見；Escape 關閉後回按鈕；200% 縮放主要操作可完成 | 瀏覽器／實機 |
| QA-13／01／03／05 | A 搜尋延遲，B 後送先完成；快速換 ID；W3 多關聯、size=2、超總頁 | 最終只顯示 B／最新 ID；3 筆無重複／漏列；超頁 200 空結果且可回第一頁 | MySQL＋瀏覽器 |
| QA-14／06 | 查 main PR／審查／必要 CI／推送限制、Access 對象、登入 Rate Limit、代理 IP | 記查核時間、規則識別、遮罩證據；隔離登入正常；不以文件當雲端生效證明 | 雲端設定＋隔離整合 |
| QA-15／09 | 備份→隔離還原→數量／關聯／雜湊→baseline／遷移→新舊版本相容性 | 無非預期差異；失敗可恢復；實測 RPO／RTO 符合 D-06 | 隔離 MySQL |
| QA-16／10 | 專用 bucket 的引用中／孤立／delete/／未儲存圖；dry-run→核對→受控搬移→還原；中途失敗 | 預覽不搬物件但可寫日誌；保留及引用依 D-06；清單、還原、重試一致；無規則外永久刪除 | 隔離 MySQL＋R2 |

QA-04 排序期望：newest=[W2,W3,W1]、oldest=[W1,W2,W3]、yearDesc=[W2,W3,W1]、yearAsc=[W1,W2,W3]、sortOrder=[W1,W2,W3]。
titleAsc／titleDesc 依隔離 MySQL 記錄的 collation 預先固定次序再比較，不跨環境假設中文字序相同；空 year／title 另用副本驗證置後。

### 7.3 證據、缺陷與 UAT

每次執行新增紀錄，不覆蓋舊版結果：批次／REQ／QA、完整 SHA 與未提交差異、日期／執行者、環境／DB／bucket 識別、部署 ID（如有）、工具／瀏覽器／fixture 版本、前置／輸入／步驟／預期／實際、結果、脫敏證據／traceId、缺陷及重測連結。
結果只能用通過／失敗／阻塞／未執行／不適用（附理由）；未執行不得填通過。

歷史問題以 BUG-SEARCH-01／BUG-DETAIL-01 追蹤：輸入、資料與公開關聯狀態、HTTP／traceId、版本、頻率、最小重現與預期。未重現就保留追蹤，不把靜態改善記成已修復。
S0 越權／資料毀損、S1 核心阻斷：阻擋受影響版本發布；S2 有替代操作的非核心問題：記影響、處理版本與驗收決定；S3 視覺改善轉待辦。

- UAT-V 訪客：列表→搜「春」→分類→詳情→返回→分享 URL→無結果→清除；R2 加新篩選／排序／手機 Drawer。對應 QA-01、03～05、11、12。
- UAT-M 管理者：登入→建作者／分類／作品→上傳→發布→前台查→修改→取消發布→刪除→登出。對應 QA-06、08、09；若本版未改管理，記錄回歸抽樣理由，不直接勾全部。
- UAT-I 本版含匯入才執行：匯入→核對計數／關聯→補作者→前台查→重送防重複。對應 QA-10。
- UAT-O 本版含維運變更才執行：清理預覽／還原、DB 還原演練。對應 QA-15／16。

簽核記錄版本／環境、真人驗收者、日期、腳本結果、未解缺陷／影響、接受或退回、發布範圍。開發測試不代替使用者簽核，未指派者維持未驗收。

## 8. 發布設定、回復與維運

本次不需調整 Cloudflare Pages、Railway、R2 或環境變數。日後依 DEPLOYMENT 查核雲端實際設定；歷史部署 ID 不作為本版證據。

| 對象 | 發布前查核 | 可能後續調整 |
|---|---|---|
| Pages | frontend、main 觸發、build／dist、Node 22、VITE_API_URL／ADMIN_HOST／ADMIN_BASE_PATH、SPA 詳情直開 | R1／R2 原則沿用；重建隔離環境另配網域／API／保護 |
| Railway | /backend、profile、MySQL、Railpack JVM、health、CORS／Cookie、秘密名稱、實際 Java 版本 | 搜尋／UI 預期無新變數；migration／排程開關另提相容性與回復 |
| R2 | bucket／public URL／endpoint、物件權限、引用及現有 lifecycle | REQ-10 先預覽及還原；保留期未定不新增永久刪除 |
| GitHub | main PR／審查／必要 CI／禁止強推與直接推送、merge 自動發布 | 按實際缺口提案；本次不改 ruleset |

發布就緒：範圍定案、同版審查／CI、適用 QA／整合／UAT 通過、S0／S1 清零、必要雲端缺口補齊、備份／回復驗證、目標環境與正式授權。
無 DB／R2 變更可將資料變更專用演練列不適用並附影響分析，不能豁免受影響的查詢或登入整合。
回復紀錄含前一可用 SHA／前後端部署 ID、觸發條件、執行人、順序、DB／R2 相容性與驗證；資料變更不能只退程式，需依已演練的資料／檔案復原方案。

以下為待 D-07 確認的初始門檻，尚未量測或設定告警：

| 指標 | 建議觀察／門檻 | 處理 |
|---|---|---|
| 期間 | 發布後密集 30 分鐘，追蹤 24 小時；保存同流量發布前基準 | 指派發布負責人與備援 |
| 健康／核心流程 | 健康間隔 1 分鐘連續 2 次失敗，或核心操作持續失敗 | 立即通知、評估回復 |
| API 5xx | 5 分鐘≥3 次，或窗口≥100 請求且 5xx>1% | traceId 查錯、區分程式與依賴 |
| 查詢延遲 | 隔離環境預熱、固定 fixture、單使用者 100 次讀取 p95≤1 秒；正式 10 分鐘 p95 超同流量基準 2 倍 | 本機不當正式 SLA；低樣本看個別慢請求 |
| RAM／重啟 | 持續 10 分鐘超已確認容器限額 80%，10 分鐘重啟≥2 次或 OOM | 查 GC／併發／JVM；heap 上限不是容器總 RAM |
| DB 連線 | 連線池使用持續 5 分鐘>80% 或連線逾時 | 查慢查詢、連線回收與受影響流程 |

量測先在隔離環境，不因本規劃在正式環境壓測。回饋轉成含缺陷／需求編號、重現資料與驗收條件的 TODO。

## 9. 責任、里程碑與待確認決策

P 產品負責人：範圍、業務規格、UAT；E 開發者：設計、實作、QA；O 發布負責人：環境、備份、部署、監控。同一人可兼任，仍分別記錄。Codex 本次整理文件，不代指真人驗收者或授權者。

### 9.1 里程碑

初估以單一開發者工作日計，不含等待授權、資源、UAT 排期或未知缺陷修復；不是日期承諾。

| 里程碑 | 相依與內容 | 初估 | 退出條件 |
|---|---|---|---|
| M0 規劃交付 | 本文件、TODO、CURRENT_STATUS | 本次完成 | 文件一致，實作／測試／部署／驗收分開 |
| M1 規格與重現 | D-01～03、隔離安排、安全／清理初查 | 1～3 日 | BUG 證據或未重現範圍、契約、fixture、可用環境 |
| M2 R1 核心修正 | M1→REQ-01／02／03／05／06 回歸 | 3～6 日，未知根因另估 | 核心案例、MySQL 整合、審查與 CI |
| M3 R2 篩選體驗 | M2＋D-04／07→REQ-04／11 | 3～5 日 | 新舊篩選、分頁、URL、手機案例 |
| M4 R3 管理維運 | M1 後可設計；實作依 D-05／06、備份相依 | 先盤點 2～4 日，實作後估 | 管理／匯入、schema／備份、回收站／清理分子版 |
| M5 每版 UAT／發布 | 該版 QA＋隔離雲端證據＋授權 | 每版 1～2 日，另加 24 小時觀察 | 簽核、部署紀錄、回復與觀察完整 |

M1 後依缺陷、人力及實測成本重估，再填開始／完成日期；無開工日期不虛構日曆排程。

### 9.2 待確認決策

2026-10-08 使用者已確認 D-01 的業務／UAT 由使用者負責、Codex 負責本機開發與測試；D-02 的 200 字／100 筆上限、非法參數 400、同值 ID 排序；D-03 維持既有公開作者及分類規則。其餘待定部分保留如下，不以局部確認推定全部同意。

| 編號／負責角色 | 決策與建議 | 未確認影響 |
|---|---|---|
| D-01／P | 部分確認：使用者負責業務／UAT，Codex 本機開發／測試；投入時間及發布負責人待定 | 可進行本機工作；不虛構正式日期或視為發布授權 |
| D-02／P＋E | 部分確認：200 字／100 筆、非法參數 400、同值 ID 排序；搜尋欄位／特殊字元／排序白名單／空值仍待定 | 已確認部分可進 M2；其餘未定行為不可自行視為業務定案 |
| D-03／P | 已確認：維持既有公開作者＋分類與未刪除條件；無作者匯入作品需補關聯後才公開 | 可按此準備測試；實測／UAT 完成狀態另記 |
| D-04／P＋E | 建議布林三態、Tag 群內 OR；定 Tag 選項來源、是否需 Tag CRUD；新增 API 先查重 | 阻擋 R2 相應 UI，不影響 R1 重現 |
| D-05／P＋E | 匯入沿用重複／缺值略過；定逐列部分成功或全部回滾、錯誤回報、允許檔案格式與上傳限制 | 阻擋 QA-09／10 完整契約；不假設現況保證任一交易模式 |
| D-06／P＋O | 初始建議每日 DB 備份、保留 30 日、RPO≤24 小時、RTO≤4 小時、回收站 30 日；未儲存上傳至少留 24 小時；先 dry-run | 核對容量／成本／還原能力後才能定案；不先套 retention、永久刪除、baseline 或清理改動 |
| D-07／P＋O | 建議本機＋CI 先行，必要雲端整合另安排；桌機 Chrome／Edge、iOS Safari、Android Chrome 記實測版本；確認門檻／告警人 | 未覆蓋平台列限制；必要雲端／UAT 缺口阻擋發布；不自行重建 staging |

M0 已交付；M1 尚未整體完成。2026-10-12 M2-01 完成搜尋修正，M2-05 完成本批本機安全／管理回歸；同版 CI、必要 MySQL／瀏覽器／雲端整合及詳情偶發問題仍追蹤，UAT 與發布未完成。局部案例通過不代表 QA-06～10 全部跨環境驗收完成。
