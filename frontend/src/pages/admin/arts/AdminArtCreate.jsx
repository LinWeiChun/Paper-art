import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createArt } from '../../../api/artApi';
import { getAllAuthors } from '../../../api/authorsApi';
import { getAllCategories } from '../../../api/categoryApi';

import Editor from '../../../components/editor/Editor';

import '../../../styles/admin/adminForm.css';

function AdminArtCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    featured: false,
    rentable: true,
    authorIds: [],
    categoryIds: [],
    tagIds: [],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [authorRes, categoryRes] = await Promise.all([
        getAllAuthors(),
        getAllCategories(),
      ]);

      setAuthors(authorRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error('取得資料失敗：', error);
    }
  };

  // 一般欄位
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 圖片
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 新增作者
  const addAuthor = (id) => {
    setFormData((prev) => ({
      ...prev,
      authorIds: [...prev.authorIds, id],
    }));
  };

  // 移除作者
  const removeAuthor = (id) => {
    setFormData((prev) => ({
      ...prev,
      authorIds: prev.authorIds.filter((item) => item !== id),
    }));
  };

  // 新增分類
  const addCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: [...prev.categoryIds, id],
    }));
  };

  // 移除分類
  const removeCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.filter((item) => item !== id),
    }));
  };

  // 儲存
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createArt(formData, image);

      alert('新增成功');

      navigate('/admin/arts');
    } catch (error) {
      console.error(error);
      alert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="admin-form-container">
      <h1>新增作品</h1>

      <form onSubmit={handleSubmit}>
        {/* 標題 */}
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
            <div className="list-box">
              <h4>可選作者</h4>

              {authors
                .filter((author) => !formData.authorIds.includes(author.id))
                .map((author) => (
                  <button
                    key={author.id}
                    type="button"
                    className="list-item"
                    onClick={() => addAuthor(author.id)}
                  >
                    + {author.name}
                  </button>
                ))}
            </div>

            <div className="list-box">
              <h4>已選作者</h4>

              {formData.authorIds.map((id) => {
                const author = authors.find((a) => a.id === id);

                return (
                  <button
                    key={id}
                    type="button"
                    className="selected-item"
                    onClick={() => removeAuthor(id)}
                  >
                    × {author?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 分類 */}
        <div className="form-group">
          <label>分類</label>

          <div className="dual-list">
            <div className="list-box">
              <h4>可選分類</h4>

              {categories
                .filter(
                  (category) => !formData.categoryIds.includes(category.id),
                )
                .map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="list-item"
                    onClick={() => addCategory(category.id)}
                  >
                    + {category.name}
                  </button>
                ))}
            </div>

            <div className="list-box">
              <h4>已選分類</h4>

              {formData.categoryIds.map((id) => {
                const category = categories.find((c) => c.id === id);

                return (
                  <button
                    key={id}
                    type="button"
                    className="selected-item"
                    onClick={() => removeCategory(id)}
                  >
                    × {category?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 精選 */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            精選作品
          </label>
        </div>

        {/* 圖片 */}
        <div className="form-group">
          <label>封面圖片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>圖片預覽：</p>

              <img src={preview} alt="preview" className="preview-image" />
            </>
          )}
        </div>

        {/* 介紹 */}
        <div className="form-group">
          <label>作品介紹</label>

          <Editor
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
