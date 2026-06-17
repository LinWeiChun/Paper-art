import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCategoryById, updateCategory } from '../../../api/categoryApi';

import '../../../styles/admin/adminForm.css';

function AdminCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await getCategoryById(id);

      setName(response.data.name);
      setSortOrder(response.data.sortOrder);
    } catch (error) {
      console.error('取得分類失敗：', error);
      alert('取得分類失敗');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCategory(id, {
        name,
        sortOrder,
      });

      alert('修改成功');
      navigate('/admin/categories');
    } catch (error) {
      console.error('修改失敗：', error);
      alert('修改失敗');
    }
  };

  return (
    <div className="admin-page">
      <h1>編輯分類</h1>

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

export default AdminCategoryEdit;
