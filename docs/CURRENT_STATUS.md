## 已完成

- JWT 登入
- 作者 CRUD
- 分類 CRUD
- Tag CRUD
- 作品 CRUD
- 首頁
- 作品列表
- 作品詳情
- Server-side Search
- URL Query 同步
- Works Drawer
- 篩選 UI
- Active Tag 顯示名稱
- JWT HttpOnly Cookie 與登出 API
- CSRF 防護與嚴格 CORS
- 後端 RBAC 與 ADMIN 高風險權限
- 登入失敗限制（15 分鐘內 5 次）
- 統一 API 錯誤格式與 Trace ID
- Cloudflare Pages／Railway staging 設定
- GitHub Actions CI

## 正在開發

- 第一階段 staging 部署驗證
- search API 穩定性

## 已知問題

- search API 部分情況仍會回傳 500
- Detail 頁面偶爾出現 Art not found
- 登入限制目前使用單機記憶體；多 instance 前需改為共用儲存

## 下一步

1. 建立並驗證 Cloudflare Pages／Railway staging
2. 設定 Cloudflare Access、登入 Rate Limit 與 GitHub ruleset
3. 修正 search API 並補完整測試
4. 進入第二階段：Flyway、備份、回收站與 R2 生命週期
