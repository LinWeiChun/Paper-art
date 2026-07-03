import { useEffect, useState } from 'react';

import { getAbout, updateAbout } from '../../../api/aboutApi';
import Editor from '../../../components/editor/Editor';

import '../../../styles/admin/adminForm.css';

const sortValues = (values = []) => {
  return [...values].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a.sortOrder))
      ? Number(a.sortOrder)
      : Number.MAX_SAFE_INTEGER;
    const bOrder = Number.isFinite(Number(b.sortOrder))
      ? Number(b.sortOrder)
      : Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
};

function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const data = response.data;

      setFormData({
        bannerTitle: data.bannerTitle ?? '',
        bannerSubtitle: data.bannerSubtitle ?? '',
        storyTitle: data.storyTitle ?? '',
        storyContent: data.storyContent ?? '',
        vision: data.vision ?? '',
        values: sortValues(data.values ?? []),
      });
    } catch (error) {
      console.error(error);
      alert('取得資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValueChange = (index, field, value) => {
    setFormData((prev) => {
      const newValues = [...prev.values];

      newValues[index] = {
        ...newValues[index],
        [field]: value,
      };

      return {
        ...prev,
        values: newValues,
      };
    });
  };

  const handleAddValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          id: Date.now(),
          title: '',
          description: '',
          sortOrder: prev.values.length + 1,
        },
      ],
    }));
  };

  const handleDeleteValue = (id) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((item) => item.id !== id),
    }));
  };

  const handleStoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      storyContent: value,
    }));
  };

  const handleVisionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      vision: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const requestData = {
        bannerTitle: formData.bannerTitle,
        bannerSubtitle: formData.bannerSubtitle,
        storyTitle: formData.storyTitle,
        storyContent: formData.storyContent,
        vision: formData.vision,

        values: formData.values
          .filter((item) => item.title?.trim() && item.description?.trim())
          .map((item) => ({
            title: item.title.trim(),
            description: item.description.trim(),
            sortOrder: Number(item.sortOrder) || 0,
          })),
      };

      await updateAbout(requestData);

      alert('儲存成功');
      // 重新載入最新資料
      await fetchAbout();
    } catch (error) {
      console.error(error);
      alert('儲存失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-page">資料載入中...</div>;
  }

  return (
    <div className="admin-page">
      <h1>關於我們維護</h1>

      <form onSubmit={handleSubmit}>
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

          <Editor value={formData.storyContent} onChange={handleStoryChange} />
        </div>

        <h2>願景</h2>

        <div className="form-group">
          <label>願景內容</label>

          <Editor value={formData.vision} onChange={handleVisionChange} />
        </div>

        <h2>核心價值</h2>

        <div className="form-group">
          {formData.values.map((item, index) => (
            <div key={item.id || index} className="value-row">
              <input
                type="number"
                placeholder="排序"
                value={item.sortOrder ?? 0}
                onChange={(e) =>
                  handleValueChange(index, 'sortOrder', e.target.value)
                }
              />

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
            className="btn btn-add"
            onClick={handleAddValue}
          >
            ＋ 新增核心價值
          </button>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-add" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAbout;
