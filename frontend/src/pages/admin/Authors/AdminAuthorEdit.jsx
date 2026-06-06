import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminAuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentAuthor = {
    name: '李煥章',
    title: '傳統剪紙藝術家',
    description: '長期投入傳統剪紙藝術創作。',
    image: '/images/author1.jpg',
  };

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setFormData({
      name: currentAuthor.name,
      title: currentAuthor.title,
      description: currentAuthor.description,
    });
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

    navigate('/admin/authors');
  };

  return (
    <div className="admin-page">
      <h1>編輯作者</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>作者姓名</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>職稱</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>目前照片</label>

          <img
            src={currentAuthor.image}
            alt="原圖"
            className="preview-image"
          />
        </div>

        <div className="form-group">
          <label>更換照片</label>

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

        <div className="form-group">
          <label>作者介紹</label>

          <textarea
            rows="8"
            name="description"
            value={formData.description}
            onChange={handleChange}
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

          <button type="submit" className="btn btn-primary">
            儲存
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAuthorEdit;