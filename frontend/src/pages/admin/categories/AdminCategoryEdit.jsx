import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');

  useEffect(() => {
    // 模擬取得資料
    setName('傳統剪紙');
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('修改成功');

    navigate('/admin/categories');
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