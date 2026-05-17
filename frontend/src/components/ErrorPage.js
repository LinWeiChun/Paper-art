// src/js/ErrorPages.js
function NotFound() {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>抱歉，您訪問的頁面不存在。</p>
    </div>
  );
}

function BadRequest() {
  return (
    <div>
      <h1>400 Bad Request</h1>
      <p>您的請求有誤，請檢查網址或輸入。</p>
    </div>
  );
}

function ServerError() {
  return (
    <div>
      <h1>500 Internal Server Error</h1>
      <p>伺服器發生錯誤，請稍後再試。</p>
    </div>
  );
}

// 匯出多個元件
export { NotFound, BadRequest, ServerError };
