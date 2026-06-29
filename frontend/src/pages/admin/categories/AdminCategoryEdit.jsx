import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCategoryById, updateCategory } from '../../../api/categoryApi';
import { createDefaultCategoryForm } from '../../../constants/pageDefaults';

import '../../../styles/admin/adminForm.css';

function AdminCategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(createDefaultCategoryForm);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await getCategoryById(id);

      setFormData({
        name: response.data.name || '',
        sortOrder: response.data.sortOrder || 0,
        published: response.data.published ?? true,
      });
    } catch (error) {
      console.error(error);
      alert('取得分類失敗');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'sortOrder'
            ? Number(value)
            : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await updateCategory(id, formData);

      alert('修改成功');

      navigate('/admin/categories');
    } catch (error) {
      console.error(error);

      alert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1>編輯分類</h1>

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

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            發布到前台
          </label>
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

export default AdminCategoryEdit;
