# M2-01 搜尋修正與回歸紀錄

執行日期：2026-10-12；執行者：Codex。需求與業務規格由使用者確認，UAT 尚未執行。
基準提交：`b4ee38bb366bfecf0192a28670f8c31ddf0cdf7f`，本次結果對應此基準上的未提交工作區差異。開始時已有 M0／M1 文件及診斷測試，保留其成果。

## 結果與範圍

M2-01A／B／C 本機實作與回歸完成。H2 與隔離 MySQL 的原有 7 個失敗案例均通過；沒有宣稱涵蓋所有歷史搜尋事故。

| 工作 | 實作及驗證 |
|---|---|
| M2-01A 請求解析 | MethodArgumentTypeMismatchException、HttpMessageNotReadableException 回 400／INVALID_REQUEST；不直接將例外文字回給使用者，保留 ApiError、path、timestamp、traceId 與 X-Trace-Id |
| M2-01B 上限 | 搜尋 DTO 使用既有 Jakarta Validation 的 @Size(max=200)，Controller 啟用 @Valid；Service 拒絕 size>100，保留 PageRequest 的 page<0／size<1 拒絕 |
| M2-01B 排序 | 原有主排序後追加 id ASC；不改動主排序方向、未知 sort 的預設處理、公開資格或新增 API |
| M2-01C 回歸入口 | ArtApiDiagnostics 改為 ArtApiRegressionTests，納入預設 Maven／既有 CI test；ArtApiMysqlDiagnostics 改為 ArtApiMysqlIT，透過下列獨立整合入口執行相同案例 |
| 系統錯誤 | 新增 GlobalExceptionHandlerTests，以實際 MVC 請求注入未知系統例外，確認仍回 500／INTERNAL_ERROR，回應不包含 SQL、例外類型或堆疊 |

keyword 長度依 Jakarta @Size 的 Java 字串長度計算，驗證原始輸入後才沿用既有 trim 搜尋。中文字邊界已測；特殊字元搜尋語意、完整排序白名單及空值策略仍屬 D-02 待確認範圍。
共用例外處理會套用到其他 Controller 的相同解析錯誤；本次不改安全規則、JWT、資料庫 schema、R2、前端或部署設定。

## 本次測試證據

環境：Windows、JDK 18.0.2.1（pom 編譯目標 17）、Maven 3.9.15、Spring Boot 3.5.3、H2 2.3.232；隔離 MySQL 9.7.2，collation=utf8mb4_0900_ai_ci。

| 驗證 | 結果 |
|---|---|
| 預設後端測試 | 34 通過，0 失敗／錯誤／略過；包含原有 11 項、H2 搜尋回歸 22 項、系統錯誤 1 項 |
| 隔離 MySQL | 22 通過，0 失敗／錯誤／略過；執行與 H2 相同的搜尋／可見性案例 |
| Spotless | check 通過；本次先 apply，再於 MySQL 執行前 check |
| 文件／差異 | 核對文件連結、工作狀態及 git diff --check；完整實作與測試檔案如下 |

22 項搜尋回歸組成：

- 9 項非法輸入：負頁、size=0、非數字 page／size、缺 body、壞 JSON、錯誤布林、size=101、keyword=201；驗證 400、錯誤代碼、追蹤欄位及不暴露內部資料。
- 1 項上限成功：200 個中文字、size=100，查得到實際符合的作品。
- 9 項排序：預設、sortOrder、oldest、newest、yearAsc、yearDesc、titleAsc、titleDesc、未知 sort 的原有 fallback；兩筆同值作品跨頁依 ID 升冪，另一筆仍遵循主排序，超出最後一頁回空結果。
- 3 項既有案例：搜尋／關鍵字／關聯篩選及分頁、詳情公開資格、搜尋 CSRF 與後台詳情未登入限制。

原始日誌在 `backend/target/m2-regression.log`、`m2-mysql.log`、`surefire-reports`，受 Git 忽略且可能被重建清除；上述結果保留於本文件。
第一次受限環境啟動停滯，已停止該次 Java 程序並以一般權限完成測試；`m2-before.log` 不是有效的修正前失敗證據。修正前根因與 7 個失敗以 [M1 紀錄](M1_EXECUTION.md) 為準。

已檢視的日誌限制：新空 MySQL 執行 create-drop 時先刪除尚不存在資料表的外鍵，產生初始化警告；之後成功建表並完成全部案例。另有既有 PageImpl 序列化、dialect／commons-logging 警告；本次未改回應模型或依賴。系統錯誤測試故意產生一筆 ERROR 日誌，對外回應已驗證不含內部資料。

## 可重跑入口

### 日常與 CI

在 backend 目錄，以相容 JDK 執行：

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-18.0.2'
.\mvnw.cmd -o '-DargLine=-Djdk.attach.allowAttachSelf=true' spotless:check test
```

`-o` 使用本機快取；新機器需先下載依賴。Linux／CI 沿用 `sh mvnw spotless:check test`，現有 CI 指定 Java 17，會依預設命名包含 ArtApiRegressionTests 及 GlobalExceptionHandlerTests。**本次未推送或觸發遠端 CI，也未取得 Java 17 的新結果**；Java 17／同版 CI 由 M2-06 承接。

### 隔離 MySQL 整合

只可使用本機暫存容器；先確認 127.0.0.1:33316 無既有服務、容器名稱未使用。測試固定連 paperart_m1，使用 create-drop，每案重建 fixture；不可改連正式／共享 DB。沿用 M1 本機測試帳密與 DB 名稱，以下皆為測試專用值。

```powershell
docker run --rm --detach --name paperart-m2-20261012 --label paperart.scope=m2-search-regression --publish 127.0.0.1:33316:3306 --env MYSQL_DATABASE=paperart_m1 --env MYSQL_USER=m1 --env MYSQL_PASSWORD=m1-local-only --env MYSQL_ROOT_PASSWORD=m1-root-local-only mysql:9@sha256:e2bde46db6563855d7177adb5f0b57b9dc663f5a20927a90f4259d3312068497
docker exec paperart-m2-20261012 mysqladmin ping -h 127.0.0.1 -um1 -pm1-local-only
```

只有 ping 回 `mysqld is alive` 才執行；在 backend 目錄使用上述 JDK：

```powershell
try {
    .\mvnw.cmd -o '-Dtest=ArtApiMysqlIT' '-DargLine=-Djdk.attach.allowAttachSelf=true' spotless:check test
    if ($LASTEXITCODE -ne 0) { throw 'MySQL 回歸失敗，請檢查測試報告。' }
} finally {
    docker stop paperart-m2-20261012
}
```

MySQL 不在預設 CI 內，須另執行此入口。兩套搜尋測試均固定 test profile、mock S3Client 與清理排程，且逐案驗證沒有 S3 呼叫；未在測試外層開交易，避免掩蓋 Controller／Service 邊界的延遲載入問題。
本次容器無既有資料掛載，已 stop 並自動移除；映像快取保留。Docker Desktop 原先停止，本次測後恢復停止。

## 完整實作及版本識別

以下 SHA-256 對應本機已測試檔案的位元組；換行轉換後雜湊可能不同。

| 完整檔案 | SHA-256 |
|---|---|
| [ArtController](../backend/src/main/java/com/paperart/backend/controller/ArtController.java) | E050D32DD500D3315F569506CD47C4DAE771B4ED55C2DC45C50AA6474BBFF9D5 |
| [ArtSearchRequest](../backend/src/main/java/com/paperart/backend/dto/request/ArtSearchRequest.java) | 587F8BCA99A14DAEDCF249C1904AECF6747AFE6232A58EE97FBE85469E0FD7B2 |
| [GlobalExceptionHandler](../backend/src/main/java/com/paperart/backend/exception/GlobalExceptionHandler.java) | 3B97381411D3BB75F733540F6721176871AE999D8776C2D98CB68F040FEAC276 |
| [ArtServiceImpl](../backend/src/main/java/com/paperart/backend/service/impl/ArtServiceImpl.java) | 28A527A21FB5EE6E330DDD81043068EBAE70084AA949417C68C331BB517A2D23 |
| [ArtApiRegressionTests](../backend/src/test/java/com/paperart/backend/diagnostics/ArtApiRegressionTests.java) | 9C8A3774E4FCA2529F4526891DC3034EAA1BC2B4449B0BD106477A4771B9BC32 |
| [ArtApiMysqlIT](../backend/src/test/java/com/paperart/backend/diagnostics/ArtApiMysqlIT.java) | FB8513C2E0342255CBB70DA0E8E1AA027FBB5B6461A12C67F16FECA891061FFF |
| [GlobalExceptionHandlerTests](../backend/src/test/java/com/paperart/backend/exception/GlobalExceptionHandlerTests.java) | FA6F050D5AC27410F761F8A9CD67F019763EA9847E8166C361FEB5AABB57127E |

## 尚未完成

- M2-05 的完整共用權限回歸及 M2-06 的版本審查／Java 17 CI，另列工作；本次通過的登入、CSRF 與未登入案例不代表完整安全驗收。
- M1-05 詳情偶發問題、瀏覽器錯誤與競態，及 M1-06 Cloudflare R2 清理風險仍待處理。
- 未執行前端／瀏覽器、真實 R2、跨網域或正式環境測試，未重新查核雲端；未提交、推送、部署或 UAT。
- 不需調整 Railway、Cloudflare Pages／R2 或環境變數。M2-01 完成不等於整個 M2／R1 完成或發布就緒。
