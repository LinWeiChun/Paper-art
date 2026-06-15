import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getAuthorById, updateAuthor } from '../../../api/authorsApi';
import TextEditor from '../../../components/admin/TextEditor';

import '../../../styles/admin/adminForm.css';

function AdminAuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const previousPage = location.state?.page || 1;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    sortOrder: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 取得作者資料
  useEffect(() => {
    fetchAuthor();
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const response = await getAuthorById(id);

      // console.log(response.data); // ← 已經有資料

      setFormData({
        name: response.data.name || '',
        title: response.data.title || '',
        description: response.data.description || '',
        sortOrder: response.data.sortOrder || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };
  // 一般欄位
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  // 儲存
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAuthor(id, formData, image);

      alert('修改成功');

      navigate(`/admin/authors?page=${previousPage}`);
    } catch (error) {
      console.error(error);

      alert('修改失敗');
    }
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

        {/* 排序 */}
        <div className="form-group">
          <label>排序</label>

          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
          />
        </div>

        {/* 目前照片 */}
        {preview && (
          <div className="form-group">
            <label>目前照片</label>

            <img src={preview} alt="作者照片" className="preview-image" />
          </div>
        )}

        {/* 更換照片 */}
        <div className="form-group">
          <label>更換照片</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* 作者介紹 */}
        <div className="form-group">
          <label>作者介紹</label>

          <TextEditor
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                description: value,
              }))
            }
          />
        </div>

        {/* 按鈕 */}
        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/authors?page=${previousPage}`)}
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
