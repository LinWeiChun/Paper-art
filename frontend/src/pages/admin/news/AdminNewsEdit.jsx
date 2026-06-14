import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getNewsById, updateNews } from '../../../api/newsApi';

import SummaryEditor from '../../../components/admin/SummaryEditor';
import TextEditor from '../../../components/admin/TextEditor';

import '../../../styles/admin/adminForm.css';

function AdminNewsEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const page = location.state?.page || 1;

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
  });

  const [currentImage, setCurrentImage] = useState('');

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await getNewsById(id);

      const newsData = response.data;

      setFormData({
        title: newsData.title || '',
        date: newsData.publishDate ? newsData.publishDate.substring(0, 10) : '',
        summary: newsData.summary || '',
        content: newsData.content || '',
      });

      setCurrentImage(newsData.coverImage || '');
    } catch (error) {
      console.error(error);
      alert('取得資料失敗');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const newsData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        publishDate: formData.date,
        status: 'PUBLISHED',
        featured: false,
      };

      const requestData = new FormData();

      requestData.append(
        'news',
        new Blob([JSON.stringify(newsData)], {
          type: 'application/json',
        }),
      );

      // 有選新圖片才上傳
      if (image) {
        requestData.append('image', image);
      }

      await updateNews(id, requestData);

      alert('修改成功');

      navigate(`/admin/news?page=${page}`);
    } catch (error) {
      console.error(error);

      alert('修改失敗');
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

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

          {currentImage && (
            <img src={currentImage} alt="原圖" className="preview-image" />
          )}
        </div>

        {/* 更換圖片 */}
        <div className="form-group">
          <label>更換圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>新圖片預覽：</p>

              <img src={preview} alt="新圖" className="preview-image" />
            </>
          )}
        </div>

        {/* 摘要 */}
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

        {/* 詳細內容 */}
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
            onClick={() => navigate(`/admin/news?page=${page}`)}
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

export default AdminNewsEdit;
