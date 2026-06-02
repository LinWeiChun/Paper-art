import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 進入登入頁就登出
  useEffect(() => {
    sessionStorage.removeItem('token');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 之後改成呼叫 Spring Boot API
    if (username === 'admin' && password === '123456') {
      sessionStorage.setItem('token', 'fake-token');

      navigate('/admin');
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>管理者登入</h1>

        <div className="form-group">
          <label>帳號</label>
          <input
            type="text"
            placeholder="請輸入帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>密碼</label>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
