import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { getAllRoles } from '../../../api/roleApi';
import { createUser } from '../../../api/userApi';
import { createDefaultUserForm } from '../../../constants/pageDefaults';

import '../../../styles/admin/adminForm.css';

function AdminUserCreate() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [allRoles, setAllRoles] = useState([]);

  const [formData, setFormData] = useState(createDefaultUserForm);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();

      setAllRoles(response.data);
    } catch (error) {
      console.error(error);
      alert('取得權限失敗');
    }
  };

  // 一般欄位
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 新增權限
  const addRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: [...prev.roles, role],
    }));
  };

  // 移除權限
  const removeRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((item) => item !== role),
    }));
  };

  // 儲存
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser(formData);

      alert('新增成功');

      navigate('/admin/users');
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
  };

  return (
    <div className="admin-page">
      <h1>新增管理者</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 帳號 */}
        <div className="form-group">
          <label>帳號</label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* 密碼 */}
        <div className="form-group">
          <label>密碼</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
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

        {/* 權限 */}
        <div className="form-group">
          <label>權限設定</label>

          <div className="dual-list">
            {/* 左邊 */}
            <div className="list-box">
              <h4>可選權限</h4>

              {allRoles
                .filter((role) => !formData.roles.includes(role))
                .map((role) => (
                  <button
                    key={role}
                    type="button"
                    className="list-item"
                    onClick={() => addRole(role)}
                  >
                    + {role}
                  </button>
                ))}
            </div>

            {/* 右邊 */}
            <div className="list-box">
              <h4>已選權限</h4>

              {formData.roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  className="selected-item"
                  onClick={() => removeRole(role)}
                >
                  × {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 啟用 */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
            />

            <span>啟用帳號</span>
          </label>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/users')}
          >
            返回列表
          </button>

          <button type="submit" className="btn btn-primary">
            儲存
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminUserCreate;
