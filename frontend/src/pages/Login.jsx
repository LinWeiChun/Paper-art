import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser, login } from '../api/authApi';
import { adminPath } from '../routes/adminRoutes';
import { saveAuthSession } from '../utils/authSession';

import '../styles/pages/login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await login({
        username,
        password,
      });

      saveAuthSession(response.data);
      navigate(adminPath());
    } catch (error) {
      const message = error.response?.data?.message || '帳號或密碼錯誤';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        saveAuthSession(response.data);
        navigate(adminPath());
      })
      .catch(() => {});

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

        {errorMessage && (
          <p className="login-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? '登入中...' : '登入'}
        </button>
      </form>
    </div>
  );
}

export default Login;
