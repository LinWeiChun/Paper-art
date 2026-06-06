import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminNewsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
  });

  const [currentImage, setCurrentImage] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 模擬取得舊資料
  useEffect(() => {
    const newsData = {
      title: '2026 春季剪紙展',
      date: '2026-03-15',
      summary: '展出老師近年代表作品。',
      content: '詳細內容...',
      image: '/images/news1.jpg',
    };

    setFormData({
      title: newsData.title,
      date: newsData.date,
      summary: newsData.summary,
      content: newsData.content,
    });

    setCurrentImage(newsData.image);
  }, [id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    console.log(image);

    alert('修改成功');

    navigate('/admin/news');
  };

  return (
    <div className="admin-page">
      <h1>編輯最新消息</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 標題 */}
        <div className="form-group">
          <label>標題</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* 日期 */}
        <div className="form-group">
          <label>日期</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* 原圖片 */}
        <div className="form-group">
          <label>目前圖片</label>

          <img
            src={currentImage}
            alt="原圖"
            className="preview-image"
          />
        </div>

        {/* 新圖片 */}
        <div className="form-group">
          <label>更換圖片</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <>
              <p>新圖片預覽：</p>

              <img
                src={preview}
                alt="新圖"
                className="preview-image"
              />
            </>
          )}
        </div>

        {/* 摘要 */}
        <div className="form-group">
          <label>摘要</label>

          <textarea
            name="summary"
            rows="3"
            value={formData.summary}
            onChange={handleChange}
          />
        </div>

        {/* 詳細內容 */}
        <div className="form-group">
          <label>詳細資訊</label>

          <textarea
            name="content"
            rows="8"
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/news')}
          >
            返回列表
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminNewsEdit;