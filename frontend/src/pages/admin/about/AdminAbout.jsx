import { useState } from 'react';

import TextEditor from '../../../components/admin/TextEditor';
import '../../../styles/admin/adminForm.css';

function AdminAbout() {
  const [formData, setFormData] = useState({
    bannerTitle: '關於我們',
    bannerSubtitle: '傳承剪紙文化，延續匠人精神',

    storyTitle: '李煥章剪紙藝術',

    storyContent:
      '李煥章老師長年投入傳統剪紙藝術創作，將民俗文化、吉祥寓意與現代美學融合於作品之中。\n\n剪紙不只是技藝，更是一種文化記憶。我們希望透過作品展示、教育推廣與文化交流，讓更多人認識這門珍貴的傳統藝術。',

    values: [
      {
        id: 1,
        title: '文化傳承',
        description: '保存傳統剪紙技藝與文化意涵。',
      },
      {
        id: 2,
        title: '藝術推廣',
        description: '讓更多人接觸並喜愛剪紙藝術。',
      },
      {
        id: 3,
        title: '創新發展',
        description: '結合現代設計，展現剪紙藝術新生命。',
      },
    ],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert('儲存成功');
  };

  return (
    <div className="admin-form-container">
      <h1>關於我們維護</h1>

      <form onSubmit={handleSubmit}>
        {/* Banner */}
        <h2>Banner 區塊</h2>

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
        </div>

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

        {/* 核心價值 */}
        <h2>核心價值</h2>

        <div className="form-group">
          {formData.values.map((item, index) => (
            <div key={item.id} className="value-row">
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
