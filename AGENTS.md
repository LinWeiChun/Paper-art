# PaperArt 專案交接

你現在接手 PaperArt 專案。

## 開始工作前

請先閱讀：

1. docs/README.md
2. docs/PROJECT_STRUCTURE.md
3. docs/CURRENT_STATUS.md
4. docs/TODO.md

閱讀完成後，先確認你已理解專案，再開始修改。

---

## Tech Stack

### Frontend
- React
- React Router
- Axios

### Backend
- Spring Boot
- Spring Security
- MySQL

### Storage
- Cloudflare R2

### Deployment
- Railway（Backend）
- Vercel（Frontend）

---

## 開發規範

- 保持既有架構。
- 優先修改既有程式，不要無故重構。
- 不更換框架或主要套件，除非我明確要求。
- 不新增重複 API。
- 優先重用現有元件、Service、Repository、Utility。
- 維持既有命名與程式風格。
- 若需要調整架構，請先說明原因與影響。

---

## 回覆格式

每次回覆請依序提供：

1. 問題分析
2. 修改方案
3. 需修改的檔案
4. 完整程式碼（不要只提供片段）

若涉及 Cloudflare R2、Railway、Vercel 或環境變數，請一併說明需要調整的部署設定。