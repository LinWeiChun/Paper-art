# PaperArt

剪紙藝術作品展示平台。

## 文件導覽

| 文件 | 用途 |
|---|---|
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 前後端分層與 CI 結構 |
| [CURRENT_STATUS.md](CURRENT_STATUS.md) | 實作狀態、歷史驗證與待確認問題 |
| [TODO.md](TODO.md) | 優先級、相依項目與完成條件 |
| [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) | 需求、設計、開發、測試、驗收與維運流程 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 環境變數、發布檢查、回復方案與歷史紀錄 |

開始工作前依序閱讀本文件、專案結構、目前狀態與待辦；規劃新功能或發布時，再閱讀開發流程及部署文件。

## 技術架構

- Frontend：React + Vite，部署於 Cloudflare Pages
- Backend：Spring Boot + Spring Security，部署於 Railway
- Database：MySQL
- Storage：Cloudflare R2

## 環境

以下依既有部署紀錄整理，2026-10-07 文件整理未重新查驗雲端狀態。

- 正式：`main`、`paper-cut.org`、`admin.paper-cut.org`、`api.paper-cut.org`
- Staging：已於 2026-09-14 下線；Railway staging（含測試 MySQL）與 Cloudflare Pages `paper-art-staging` 已刪除。`development` 分支及 R2 檔案保留，未再部署 staging。

部署與環境變數請參考 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 目前工作方向

先核對功能與驗收範圍，再處理搜尋及詳情問題、篩選與操作狀態，接續安全及資料維運工作。
已實作不代表目前版本已通過整合測試、正式部署或使用者驗收。
