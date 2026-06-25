import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getBannerById, updateBanner } from '../../../api/bannerApi';

import '../../../styles/admin/adminForm.css';

function AdminBannerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortOrder: 0,
    active: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getBannerById(id);

      setFormData({
        title: response.data.title || '',
        subtitle: response.data.subtitle || '',
        sortOrder: response.data.sortOrder || 0,
        active: response.data.active ?? true,
      });

      setPreview(response.data.image);
    } catch (error) {
      console.error('取得 Banner 失敗：', error);
      alert('取得資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

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

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateBanner(id, formData, image);

      alert('修改成功');

      navigate('/admin/banners');
    } catch (error) {
      console.error('修改失敗：', error);
      alert('修改失敗');
    }
  };

  if (loading) {
    return <div className="admin-page">載入中...</div>;
  }

  return (
    <div className="admin-page">
      <h1>編輯 Banner</h1>

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

          <button type="submit" className="btn btn-add" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminBannerEdit;
