import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createNews } from '../../../api/newsApi';
import SummaryEditor from '../../../components/admin/SummaryEditor';
import TextEditor from '../../../components/admin/TextEditor';
import '../../../styles/admin/adminForm.css';

function AdminNewsCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
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

    setLoading(true);

    try {
      const news = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        publishDate: formData.date,
        status: 'PUBLISHED',
        featured: false,
      };

      const data = new FormData();

      data.append(
        'news',
        new Blob([JSON.stringify(news)], {
          type: 'application/json',
        }),
      );

      if (image) {
        data.append('image', image);
      }

      await createNews(data);

      alert('新增成功');

      navigate('/admin/news');
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>新增最新消息</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>標題</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>日期</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>上傳圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>圖片預覽：</p>

              <img src={preview} alt="預覽" className="preview-image" />
            </>
          )}
        </div>

        <div className="form-group">
          <label>摘要</label>

          <SummaryEditor
            value={formData.summary}
            onChange={(value) =>
              setFormData({
                ...formData,
                summary: value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>詳細資訊</label>

          <TextEditor
            value={formData.content}
            onChange={(value) =>
              setFormData({
                ...formData,
                content: value,
              })
            }
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminNewsCreate;
