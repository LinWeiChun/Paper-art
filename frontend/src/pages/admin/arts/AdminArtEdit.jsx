import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAdminArtById, updateArt } from '../../../api/artApi';

import { getAdminAuthors } from '../../../api/authorsApi';
import { getAdminCategories } from '../../../api/categoryApi';

import Editor from '../../../components/editor/Editor';
import { createDefaultArtForm } from '../../../constants/pageDefaults';
import { adminPath } from '../../../routes/adminRoutes';

import '../../../styles/admin/adminForm.css';

function AdminArtEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(() =>
    createDefaultArtForm({
      rentable: false,
    }),
  );

  const [image, setImage] = useState(null);

  // 顯示圖片用
  const [preview, setPreview] = useState(null);

  const buildRequestData = () => ({
    ...formData,
    year: formData.year === '' ? null : Number(formData.year),
    lengthCm: formData.lengthCm === '' ? null : Number(formData.lengthCm),
    widthCm: formData.widthCm === '' ? null : Number(formData.widthCm),
    heightCm: formData.heightCm === '' ? null : Number(formData.heightCm),
    sortOrder: Number(formData.sortOrder) || 0,
  });

  // 防止重複送出
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [artRes, authorRes, categoryRes] = await Promise.all([
        getAdminArtById(id),
        getAdminAuthors(0, 1000),
        getAdminCategories(0, 1000),
      ]);

      const art = artRes.data;

      setAuthors(authorRes.data.content || []);
      setCategories(categoryRes.data.content || []);

      setFormData({
        title: art.title || '',
        artNumber: art.artNumber || '',
        description: art.description || '',
        year: art.year ?? '',
        lengthCm: art.lengthCm ?? '',
        widthCm: art.widthCm ?? '',
        heightCm: art.heightCm ?? '',
        material: art.material || '',
        color: art.color || '',
        technique: art.technique || '',
        creationPeriod: art.creationPeriod || '',
        artworkType: art.artworkType || '',
        remarks: art.remarks || '',
        sortOrder: art.sortOrder ?? 0,
        featured: art.featured ?? false,
        rentable: art.rentable ?? true,
        published: art.published ?? true,

        // 將後端回傳的 id + name 轉成 id 陣列
        authorIds: art.authors?.map((a) => a.id) || [],
        categoryIds: art.categories?.map((c) => c.id) || [],
        tagIds: art.tags?.map((t) => t.id) || [],
      });

      setPreview(art.thumbnail);
    } catch (error) {
      console.error('載入失敗：', error);
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

  // 更換圖片
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 作者
  const addAuthor = (id) => {
    setFormData((prev) => ({
      ...prev,
      authorIds: [...prev.authorIds, id],
    }));
  };

  const removeAuthor = (id) => {
    setFormData((prev) => ({
      ...prev,
      authorIds: prev.authorIds.filter((item) => item !== id),
    }));
  };

  // 分類
  const addCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: [...prev.categoryIds, id],
    }));
  };

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
      await updateArt(id, buildRequestData(), image);

      alert('修改成功');

      navigate(adminPath('arts'));
    } catch (error) {
      console.error(error);
      alert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1>編輯作品</h1>

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

        <div className="form-grid">
          <div className="form-group">
            <label>作品編號</label>

            <input
              type="text"
              name="artNumber"
              value={formData.artNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>排序</label>

            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>創作年份</label>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>製作年代 / 時空背景</label>

            <input
              type="text"
              name="creationPeriod"
              value={formData.creationPeriod}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid three-columns">
          <div className="form-group">
            <label>長(cm)</label>

            <input
              type="number"
              step="0.1"
              name="lengthCm"
              value={formData.lengthCm}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>寬(cm)</label>

            <input
              type="number"
              step="0.1"
              name="widthCm"
              value={formData.widthCm}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>高(cm)</label>

            <input
              type="number"
              step="0.1"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>材質</label>

            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>色彩</label>

            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>剪刻技法 / 製作手法</label>

            <input
              type="text"
              name="technique"
              value={formData.technique}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>作品型態</label>

            <input
              type="text"
              name="artworkType"
              value={formData.artworkType}
              onChange={handleChange}
            />
          </div>
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
          <label>作品設定</label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            精選作品
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rentable"
              checked={formData.rentable}
              onChange={handleChange}
            />
            可租借
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            發布到前台
          </label>
        </div>

        <div className="form-group">
          <label>備註</label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* 圖片 */}
        <div className="form-group">
          <label>封面圖片</label>

          {preview && (
            <>
              <p>目前圖片：</p>

              <img src={preview} alt="preview" className="preview-image" />
            </>
          )}

          <input type="file" accept="image/*" onChange={handleImageChange} />
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
            onClick={() => navigate(adminPath('arts'))}
            disabled={isSubmitting}
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

export default AdminArtEdit;
