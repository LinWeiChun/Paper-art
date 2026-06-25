import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createNews } from '../../../api/newsApi';
import SummaryEditor from '../../../components/admin/SummaryEditor';
import TextEditor from '../../../components/admin/TextEditor';

import '../../../styles/admin/adminForm.css';

function AdminNewsCreate() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>新增最新消息</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label>發布日期</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>消息圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img src={preview} alt="preview" className="preview-image" />
          )}
        </div>

        <div className="form-group">
          <label>摘要</label>

          <SummaryEditor
            value={formData.summary}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                summary: value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>詳細內容</label>

          <TextEditor
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                content: value,
              }))
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

          <button type="submit" className="btn btn-add" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminNewsCreate;
