import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createBanner } from '../../../api/bannerApi';

import '../../../styles/admin/adminForm.css';

function AdminBannerCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortOrder: 0,
    active: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

    try {
      await createBanner(formData, image);

      alert('新增成功');

      navigate('/admin/banners');
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    }
  };

  return (
    <div className="admin-page">
      <h1>新增 Banner</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 標題 */}
        <div className="form-group">
          <label>標題</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* 副標題 */}
        <div className="form-group">
          <label>副標題</label>

          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
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

        {/* 啟用 */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />

            <span>啟用 Banner</span>
          </label>
        </div>

        {/* 圖片 */}
        <div className="form-group">
          <label>Banner 圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img src={preview} alt="preview" className="preview-image" />
          )}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/banners')}
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

export default AdminBannerCreate;
