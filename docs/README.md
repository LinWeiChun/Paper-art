# PaperArt

剪紙藝術作品展示平台。

## 技術架構

- Frontend：React + Vite，部署於 Cloudflare Pages
- Backend：Spring Boot + Spring Security，部署於 Railway
- Database：MySQL
- Storage：Cloudflare R2

## 環境

- 正式：`main`、`paper-cut.org`、`admin.paper-cut.org`、`api.paper-cut.org`
- Staging：`development`、獨立 Pages／Railway／MySQL／R2、Cloudflare Access 保護

部署與環境變數請參考 [DEPLOYMENT.md](DEPLOYMENT.md)。
