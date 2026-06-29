import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCategory } from '../../../api/categoryApi';
import { createDefaultCategoryForm } from '../../../constants/pageDefaults';

import '../../../styles/admin/adminForm.css';

function AdminCategoryCreate() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(createDefaultCategoryForm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === 'sortOrder' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createCategory(formData);

      alert('新增成功');

      navigate('/admin/categories');
    } catch (error) {
      console.error(error);

      alert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1>新增分類</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>分類名稱</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>排序</label>

          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
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

          <button type="submit" className="btn btn-add" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryCreate;
