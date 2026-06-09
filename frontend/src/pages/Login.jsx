import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  // 進入登入頁就登出
  useEffect(() => {
    sessionStorage.removeItem('token');
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 是否鎖定
    if (lockUntil && Date.now() < lockUntil) {
      alert('錯誤次數過多，請 5 分鐘後再試');
      return;
    }

    // 驗證碼
    if (inputCaptcha.toUpperCase() !== captcha) {
      alert('驗證碼錯誤');
      generateCaptcha();
      setInputCaptcha('');
      return;
    }

    // 帳密驗證
    if (username === 'admin' && password === '123456') {
      sessionStorage.setItem('token', 'fake-token');

      setErrorCount(0);

      navigate('/admin');
    } else {
      const count = errorCount + 1;

      setErrorCount(count);

      if (count >= 5) {
        setLockUntil(Date.now() + 5 * 60 * 1000);

        alert('錯誤達 5 次，已鎖定 5 分鐘');
      } else {
        alert(`帳號或密碼錯誤（剩餘 ${5 - count} 次）`);
      }

      generateCaptcha();
      setInputCaptcha('');
    }
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let code = '';

    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    setCaptcha(code);
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
        <div className="form-group">
          <label>驗證碼</label>

          <div className="captcha-box">
            <span>{captcha}</span>

            <button
              type="button"
              onClick={generateCaptcha}
              className="refresh-btn"
            >
              重新產生
            </button>
          </div>

          <input
            type="text"
            placeholder="請輸入驗證碼"
            value={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
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
