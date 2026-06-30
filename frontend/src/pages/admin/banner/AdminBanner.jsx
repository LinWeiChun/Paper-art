import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteBanner, getAllBanners } from '../../../api/bannerApi';
import { adminPath } from '../../../routes/adminRoutes';

import '../../../styles/admin/adminTable.css';

function AdminBanners() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getAllBanners();

      setBanners(response.data || []);
    } catch (error) {
      console.error('取得 Banner 失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此 Banner 嗎？')) return;

    try {
      await deleteBanner(id);

      alert('刪除成功');

      setBanners((prev) => prev.filter((banner) => banner.id !== id));
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Banner 管理</h1>

        <button
          className="btn btn-add"
          onClick={() => navigate(adminPath('banners/create'))}
        >
          ＋ 新增 Banner
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '22%' }}>圖片</th>
            <th style={{ width: '38%' }}>標題</th>
            <th style={{ width: '10%' }}>排序</th>
            <th style={{ width: '10%' }}>狀態</th>
            <th style={{ width: '15%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">載入中...</td>
            </tr>
          ) : banners.length === 0 ? (
            <tr>
              <td colSpan="6">目前沒有 Banner 資料</td>
            </tr>
          ) : (
            banners.map((banner, index) => (
              <tr key={banner.id}>
                <td>{index + 1}</td>

                <td>
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      style={{
                        width: '120px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                </td>

                <td>{banner.title}</td>

                <td>{banner.sortOrder}</td>

                <td>{banner.active ? '啟用' : '停用'}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() =>
                        navigate(adminPath(`banners/edit/${banner.id}`))
                      }
                    >
                      編輯
                    </button>

                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(banner.id)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBanners;
