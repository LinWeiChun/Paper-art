import { useState } from 'react';
import '../styles/user.css';

function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin1', email: 'admin1@example.com', password: '1234' },
    { id: 2, name: 'Admin2', email: 'admin2@example.com', password: 'abcd' }
  ]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // 驗證輸入是否完整
  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('所有欄位都必須填寫！');
      return false;
    }
    // 簡單 Email 格式檢查
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Email 格式不正確！');
      return false;
    }
    // 密碼長度檢查
    if (formData.password.length < 4) {
      alert('密碼至少需要 4 個字元！');
      return false;
    }
    return true;
  };

  // 新增或更新管理者
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      // 修改
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...formData } : u));
      setEditingUser(null);
    } else {
      // 新增
      const newUser = { id: Date.now(), ...formData };
      setUsers([...users, newUser]);
    }
    setFormData({ name: '', email: '', password: '' });
  };

  // 編輯管理者
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: user.password });
  };

  // 取消編輯 → 回到新增模式
  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="users-container">
      <h2>使用者管理</h2>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="名稱"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <div className="form-buttons">
          <button type="submit">{editingUser ? '更新管理者' : '新增管理者'}</button>
          <button type="button" onClick={handleCancel}>儲存/取消</button>
        </div>
      </form>

      <ul className="user-list">
        {users.map(user => (
          <li key={user.id}>
            <span>{user.name} ({user.email})</span>
            <button onClick={() => handleEdit(user)}>編輯</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
