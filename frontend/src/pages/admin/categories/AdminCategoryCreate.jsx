import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminCategoryCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(name);

    alert('新增成功');

    navigate('/admin/categories');
  };

  return (
    <div className="admin-page">
      <h1>新增分類</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>分類名稱</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/categories')}
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

export default AdminCategoryCreate;