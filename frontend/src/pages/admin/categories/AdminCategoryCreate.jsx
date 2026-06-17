import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCategory } from '../../../api/categoryApi';
import '../../../styles/admin/adminForm.css';

function AdminCategoryCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCategory({
        name,
        sortOrder,
      });

      alert('新增成功');

      navigate('/admin/categories');
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
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
            required
          />
        </div>

        <div className="form-group">
          <label>排序</label>

          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
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
