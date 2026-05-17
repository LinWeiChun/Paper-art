import { Routes, Route, Link } from 'react-router-dom';

import "../styles/admin.css";

import Users from './User';

function Admin() {
  return (
    <div>
      <h1>管理者後台</h1>
      <nav>
        <Link to="articles">文章管理</Link> | <Link to="users">使用者管理</Link>
      </nav>

      <div className="tab-content">
        <Routes>
          <Route path="articles" element={<div>文章管理頁面</div>} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
