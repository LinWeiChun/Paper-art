import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { adminPath } from '../routes/adminRoutes';

import '../styles/pages/login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaRotate, setCaptchaRotate] = useState(0);
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 產生驗證碼
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

    const length = Math.floor(Math.random() * 3) + 4;

    let code = '';

    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    setCaptcha(code);

    // 只在重新產生驗證碼時改變角度
    setCaptchaRotate(Math.floor(Math.random() * 11) - 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    // 是否鎖定
    if (lockUntil && new Date().getTime() < lockUntil) {
      alert('錯誤次數過多，請 5 分鐘後再試');
      setIsSubmitting(false);
      return;
    }

    // 驗證碼
    if (inputCaptcha !== captcha) {
      alert('驗證碼錯誤');
      generateCaptcha();
      setInputCaptcha('');
      setIsSubmitting(false);
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

      navigate(adminPath());
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
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // 已登入則直接進後台
    if (sessionStorage.getItem('token')) {
      navigate(adminPath());
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
            <span className="captcha-text">
              <span
                className="captcha-code"
                style={{
                  transform: `rotate(${captchaRotate}deg)`,
                }}
              >
                {captcha}
              </span>
            </span>

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

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? '登入中...' : '登入'}
        </button>
      </form>
    </div>
  );
}

export default Login;
