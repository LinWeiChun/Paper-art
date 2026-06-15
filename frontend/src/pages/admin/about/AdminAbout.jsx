import { useEffect, useState } from 'react';

import { getAbout, updateAbout } from '../../../api/aboutApi';
import TextEditor from '../../../components/admin/TextEditor';

import '../../../styles/admin/adminForm.css';

function AdminAbout() {
  const [formData, setFormData] = useState({
    bannerTitle: '',
    bannerSubtitle: '',
    storyTitle: '',
    storyContent: '',
    vision: '',
    values: [],
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await getAbout();

      setFormData(response.data);
    } catch (error) {
      console.error(error);

      alert('取得資料失敗');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...formData.values];

    newValues[index][field] = value;

    setFormData({
      ...formData,
      values: newValues,
    });
  };

  const handleAddValue = () => {
    setFormData({
      ...formData,
      values: [
        ...formData.values,
        {
          id: Date.now(),
          title: '',
          description: '',
          sortOrder: formData.values.length + 1,
        },
      ],
    });
  };

  const handleDeleteValue = (id) => {
    setFormData({
      ...formData,
      values: formData.values.filter((item) => item.id !== id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        bannerTitle: formData.bannerTitle,
        bannerSubtitle: formData.bannerSubtitle,
        storyTitle: formData.storyTitle,
        storyContent: formData.storyContent,
        vision: formData.vision,

        values: formData.values.map((item, index) => ({
          title: item.title,
          description: item.description,
          sortOrder: index + 1,
        })),
      };

      await updateAbout(requestData);

      alert('儲存成功');
    } catch (error) {
      console.error(error);

      alert('儲存失敗');
    }
  };

  return (
    <div className="admin-form-container">
      <h1>關於我們維護</h1>

      <form onSubmit={handleSubmit}>
        {/* Banner */}
        {/* <h2>Banner 區塊</h2>

        <div className="form-group">
          <label>Banner 標題</label>

          <input
            name="bannerTitle"
            value={formData.bannerTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Banner 副標題</label>

          <input
            name="bannerSubtitle"
            value={formData.bannerSubtitle}
            onChange={handleChange}
          />
        </div> */}

        {/* 品牌故事 */}
        <h2>品牌故事</h2>

        <div className="form-group">
          <label>品牌名稱</label>

          <input
            name="storyTitle"
            value={formData.storyTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>品牌故事內容</label>

          <TextEditor
            value={formData.storyContent}
            onChange={(value) =>
              setFormData({
                ...formData,
                storyContent: value,
              })
            }
          />
        </div>

        {/* 願景 */}
        <h2>願景</h2>

        <div className="form-group">
          <label>願景內容</label>

          <TextEditor
            value={formData.vision}
            onChange={(value) =>
              setFormData({
                ...formData,
                vision: value,
              })
            }
          />
        </div>

        {/* 核心價值 */}
        <h2>核心價值</h2>

        <div className="form-group">
          {formData.values.map((item, index) => (
            <div key={item.id || index} className="value-row">
              <input
                type="text"
                placeholder="核心價值標題"
                value={item.title}
                onChange={(e) =>
                  handleValueChange(index, 'title', e.target.value)
                }
              />

              <input
                type="text"
                placeholder="核心價值內容"
                value={item.description}
                onChange={(e) =>
                  handleValueChange(index, 'description', e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-delete"
                onClick={() => handleDeleteValue(item.id)}
              >
                刪除
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddValue}
          >
            ＋ 新增核心價值
          </button>
        </div>

        <br />
        <br />

        <button type="submit" className="btn btn-primary">
          儲存資料
        </button>
      </form>
    </div>
  );
}

export default AdminAbout;
