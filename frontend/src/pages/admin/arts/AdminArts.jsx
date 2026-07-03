import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteArt, getAdminArts } from '../../../api/artApi';

import Pagination from '../../../components/common/Pagination';
import { ADMIN_ITEMS_PER_PAGE } from '../../../constants/pageDefaults';
import { adminPath } from '../../../routes/adminRoutes';
import '../../../styles/admin/adminTable.css';

function AdminArts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [arts, setArts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );

  useEffect(() => {
    fetchArts();
  }, [currentPage]);

  useEffect(() => {
    setSearchParams({
      page: currentPage.toString(),
    });
  }, [currentPage, setSearchParams]);

  const fetchArts = async () => {
    try {
      const response = await getAdminArts(currentPage - 1, ADMIN_ITEMS_PER_PAGE);

      setArts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得作品失敗：', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此作品嗎？')) return;

    try {
      await deleteArt(id);

      alert('刪除成功');

      if (arts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchArts();
      }
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>作品管理</h1>

        <button
          className="btn btn-add"
          onClick={() => navigate(adminPath('arts/create'))}
        >
          ＋ 新增作品
        </button>
      </div>
      <table className="admin-table admin-table-fixed">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '12%' }}>縮圖</th>
            <th style={{ width: '25%' }}>作品名稱</th>
            <th style={{ width: '16%' }}>作者</th>
            <th style={{ width: '16%' }}>分類</th>
            <th style={{ width: '7%' }}>精選</th>
            <th style={{ width: '8%' }}>狀態</th>
            <th style={{ width: '14%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {arts.length === 0 ? (
            <tr>
              <td colSpan="8">目前沒有作品資料</td>
            </tr>
          ) : (
            arts.map((art, index) => (
              <tr key={art.id}>
                <td>{(currentPage - 1) * ADMIN_ITEMS_PER_PAGE + index + 1}</td>

                <td>
                  {art.thumbnail && (
                    <img
                      src={art.thumbnail}
                      alt={art.title}
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                      }}
                    />
                  )}
                </td>

                <td>{art.title}</td>

                <td>
                  {art.authors?.length
                    ? art.authors.map((author) => author.name).join('、')
                    : '-'}
                </td>

                <td>
                  {art.categories?.length
                    ? art.categories.map((category) => category.name).join('、')
                    : '-'}
                </td>

                <td>{art.featured ? '是' : '否'}</td>

                <td>{art.published ? '已發布' : '未發布'}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() =>
                        navigate(adminPath(`arts/edit/${art.id}`), {
                          state: {
                            page: currentPage,
                          },
                        })
                      }
                    >
                      編輯
                    </button>

                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(art.id)}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AdminArts;
