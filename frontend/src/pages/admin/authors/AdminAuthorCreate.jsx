import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAuthor } from '../../../api/authorsApi';

import TextEditor from '../../../components/admin/TextEditor';

import '../../../styles/admin/adminForm.css';

function AdminAuthorCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    sortOrder: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createAuthor(formData, image);

      alert('新增成功');

      navigate('/admin/authors');
    } catch (error) {
      console.error(error);

      alert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">新增作者</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 姓名 */}
        <div className="form-group">
          <label>作者姓名</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* 職稱 */}
        <div className="form-group">
          <label>職稱</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* 排序 */}
        <div className="form-group">
          <label>排序</label>

          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
          />
        </div>

        {/* 圖片 */}
        <div className="form-group">
          <label>作者照片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <label style={{ marginTop: '12px' }}>圖片預覽</label>

              <img src={preview} alt="preview" className="preview-image" />
            </>
          )}
        </div>

        {/* 介紹 */}
        <div className="form-group">
          <label>作者介紹</label>

          <TextEditor
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                description: value,
              }))
            }
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/authors')}
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

export default AdminAuthorCreate;
