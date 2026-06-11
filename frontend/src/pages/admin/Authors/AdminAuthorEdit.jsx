import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminAuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 模擬舊資料
  const currentAuthor = {
    name: '李煥章',
    title: '傳統剪紙藝術家',
    concept: '<p>以傳統文化為核心，結合現代設計理念。</p>',
    description: '<p>長期投入傳統剪紙藝術創作與文化推廣。</p>',
    experiences: [
      '2018 台灣工藝展特展',
      '2022 國際剪紙交流展',
      '2024 台北文化藝術獎',
    ],
    image: '/images/author1.jpg',
  };

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    concept: '',
    description: '',
    experiences: [''],
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setFormData({
      name: currentAuthor.name,
      title: currentAuthor.title,
      concept: currentAuthor.concept,
      description: currentAuthor.description,
      experiences: currentAuthor.experiences || [''],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 一般欄位
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 經歷修改
  const handleExperienceChange = (index, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = value;

    setFormData({
      ...formData,
      experiences: newExperiences,
    });
  };

  // 新增經歷
  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, ''],
    });
  };

  // 刪除經歷
  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index),
    });
  };

  // 更換圖片
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 送出
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('作者資料：', formData);

    alert('修改成功');

    navigate('/admin/authors');
  };

  return (
    <div className="admin-page">
      <h1>編輯作者</h1>

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

        {/* 原圖 */}
        <div className="form-group">
          <label>目前照片</label>

          <img src={currentAuthor.image} alt="原圖" className="preview-image" />
        </div>

        {/* 更換照片 */}
        <div className="form-group">
          <label>更換照片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <>
              <p>新圖片預覽：</p>

              <img src={preview} alt="新圖" className="preview-image" />
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

export default AdminAuthorEdit;
