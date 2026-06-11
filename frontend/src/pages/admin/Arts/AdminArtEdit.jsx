import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminArtEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    categories: [],
    description: '',
  });

  const [preview, setPreview] = useState(null);

  const currentArt = {
    image: '/images/demo.jpg',
  };

  useEffect(() => {
    const artData = {
      title: '春之剪影',
      authors: ['王小明', '陳美玲'],
      categories: ['傳統剪紙', '花卉系列'],
      description: '<p>作品介紹內容...</p>',
    };

    setFormData(artData);
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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('修改成功');

    navigate('/admin/arts');
  };
  const authorOptions = ['王小明', '陳美玲', '林志宏'];

  const categoryOptions = ['傳統剪紙', '花卉系列', '生肖系列', '吉祥剪紙'];
  return (
    <div className="admin-page">
      <h1>編輯作品</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 作品名稱 */}
        <div className="form-group">
          <label>作品名稱</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* 作者 */}
        <div className="form-group">
          <label>作者</label>

          <select
            multiple
            value={formData.authors}
            onChange={(e) =>
              setFormData({
                ...formData,
                authors: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                ),
              })
            }
          >
            {authorOptions.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          <small>按住 Ctrl（Windows）或 Command（Mac）可多選</small>
        </div>

        {/* 分類 */}
        <div className="form-group">
          <label>分類</label>

          <select
            multiple
            value={formData.categories}
            onChange={(e) =>
              setFormData({
                ...formData,
                categories: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                ),
              })
            }
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <small>按住 Ctrl（Windows）或 Command（Mac）可多選</small>
        </div>

        {/* 原圖 */}
        <div className="form-group">
          <label>目前圖片</label>

          <img src={currentArt.image} alt="原圖" className="preview-image" />
        </div>

        {/* 新圖 */}
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

        {/* 作品介紹 */}
        <div className="form-group">
          <label>作品介紹</label>

          <TextEditor
            value={formData.description}
            onChange={(value) =>
              setFormData({
                ...formData,
                description: value,
              })
            }
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/arts')}
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

export default AdminArtEdit;
