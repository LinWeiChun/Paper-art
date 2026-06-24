import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';

import '../styles/pages/login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  // 產生驗證碼
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let code = '';

    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    setCaptcha(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 是否鎖定
    if (lockUntil && new Date().getTime() < lockUntil) {
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

    try {
      const response = await login({
        username,
        password,
      });

      // JWT 資料存入 sessionStorage
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('username', response.data.username);
      sessionStorage.setItem('roles', JSON.stringify(response.data.roles));

      setErrorCount(0);

      alert('登入成功');

      navigate('/admin');
    } catch (error) {
      const count = errorCount + 1;

      setErrorCount(count);

      const message = error.response?.data?.message || '帳號或密碼錯誤';

      if (count >= 5) {
        setLockUntil(new Date().getTime() + 5 * 60 * 1000);

        alert('錯誤達 5 次，已鎖定 5 分鐘');
      } else {
        alert(`${message}（剩餘 ${5 - count} 次）`);
      }

      generateCaptcha();
      setInputCaptcha('');
    }
  };

  useEffect(() => {
    // 已登入則直接進後台
    if (sessionStorage.getItem('token')) {
      navigate('/admin');
      return;
    }

    generateCaptcha();

    // 隱藏登入頁 scrollbar
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [navigate]);

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
            required
          />
        </div>

        <div className="form-group">
          <label>密碼</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>驗證碼</label>

          <div className="captcha-box">
            <span>{captcha}</span>

            <button
              type="button"
              className="refresh-btn"
              onClick={generateCaptcha}
            >
              重新產生
            </button>
          </div>

          <input
            type="text"
            placeholder="請輸入驗證碼"
            value={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
            required
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
