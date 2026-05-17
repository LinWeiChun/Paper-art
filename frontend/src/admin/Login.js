import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true); // 更新登入狀態
      navigate('/admin');       // 導向到管理者頁面
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div>
      <h1>管理者登入</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="帳號"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">登入</button>
      </form>
    </div>
  );
}

export default Login;
