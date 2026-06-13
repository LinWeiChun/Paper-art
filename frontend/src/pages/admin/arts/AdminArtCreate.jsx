import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TextEditor from '../../../components/admin/TextEditor';
import '../../../styles/admin/adminForm.css';

function AdminArtCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    categories: [],
    description: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    console.log(image);

    alert('新增成功');

    navigate('/admin/arts');
  };
  const authorOptions = ['王小明', '陳美玲', '林志宏'];

  const categoryOptions = ['傳統剪紙', '花卉系列', '生肖系列', '吉祥剪紙'];
  return (
    <div className="admin-page">
      <h1>新增作品</h1>

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

          <div className="dual-list">
            {/* 左邊：可選作者 */}
            <div className="list-box">
              <h4>可選作者</h4>

              {authorOptions
                .filter((author) => !formData.authors.includes(author))
                .map((author) => (
                  <button
                    key={author}
                    type="button"
                    className="list-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        authors: [...formData.authors, author],
                      })
                    }
                  >
                    + {author}
                  </button>
                ))}
            </div>

            {/* 右邊：已選作者 */}
            <div className="list-box">
              <h4>已選作者</h4>

              {formData.authors.map((author) => (
                <button
                  key={author}
                  type="button"
                  className="selected-item"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      authors: formData.authors.filter(
                        (item) => item !== author,
                      ),
                    })
                  }
                >
                  × {author}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 分類 */}
        <div className="form-group">
          <label>分類</label>

          <div className="dual-list">
            {/* 左邊：可選分類 */}
            <div className="list-box">
              <h4>可選分類</h4>

              {categoryOptions
                .filter((category) => !formData.categories.includes(category))
                .map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="list-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        categories: [...formData.categories, category],
                      })
                    }
                  >
                    + {category}
                  </button>
                ))}
            </div>

            {/* 右邊：已選分類 */}
            <div className="list-box">
              <h4>已選分類</h4>

              {formData.categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="selected-item"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      categories: formData.categories.filter(
                        (item) => item !== category,
                      ),
                    })
                  }
                >
                  × {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 圖片 */}
        <div className="form-group">
          <label>上傳封面圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>圖片預覽：</p>

              <img src={preview} alt="preview" className="preview-image" />
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

export default AdminArtCreate;
