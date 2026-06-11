import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminAuthorCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    concept: '',
    description: '',
    experiences: [''],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 一般欄位
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 圖片上傳
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 修改經歷
  const handleExperienceChange = (index, value) => {
    const updated = [...formData.experiences];
    updated[index] = value;

    setFormData({
      ...formData,
      experiences: updated,
    });
  };

  // 新增經歷
  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, ''],
    });
  };

  // 刪除經歷（至少保留一筆）
  const removeExperience = (index) => {
    if (formData.experiences.length === 1) return;

    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index),
    });
  };

  // 送出
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      experiences: formData.experiences.filter((item) => item.trim() !== ''),
    };

    console.log('作者資料：', data);
    console.log('圖片：', image);

    alert('新增成功');

    navigate('/admin/authors');
  };

  return (
    <div className="admin-page">
      <h1>新增作者</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* 作者姓名 */}
        <div className="form-group">
          <label>作者姓名</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* 職稱 */}
        <div className="form-group">
          <label>職稱</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* 作者照片 */}
        <div className="form-group">
          <label>上傳照片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>圖片預覽：</p>

              <img src={preview} alt="preview" className="preview-image" />
            </>
          )}
        </div>

        {/* 創作理念 */}
        <div className="form-group">
          <label>創作理念</label>

          <TextEditor
            value={formData.concept}
            onChange={(value) =>
              setFormData({
                ...formData,
                concept: value,
              })
            }
          />
        </div>

        {/* 重要經歷 */}
        <div className="form-group">
          <label>重要經歷</label>

          {formData.experiences.map((item, index) => (
            <div key={index} className="experience-row">
              <input
                type="text"
                value={item}
                placeholder="請輸入重要經歷"
                onChange={(e) => handleExperienceChange(index, e.target.value)}
              />

              <button
                type="button"
                className="btn btn-delete"
                onClick={() => removeExperience(index)}
              >
                刪除
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary"
            onClick={addExperience}
          >
            ＋ 新增經歷
          </button>
        </div>

        {/* 作者介紹 */}
        <div className="form-group">
          <label>作者介紹</label>

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

        {/* 按鈕 */}
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

export default AdminAuthorCreate;
