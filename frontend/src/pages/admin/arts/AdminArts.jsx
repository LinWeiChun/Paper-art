import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteArt, getAdminArts, importArts } from '../../../api/artApi';

import Pagination from '../../../components/common/Pagination';
import { ADMIN_ITEMS_PER_PAGE } from '../../../constants/pageDefaults';
import { adminPath } from '../../../routes/adminRoutes';
import '../../../styles/admin/adminTable.css';

function AdminArts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [arts, setArts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleImport = async (e) => {
    const file = e.target.files?.[0];

    if (!file || isImporting) return;

    setIsImporting(true);

    try {
      const response = await importArts(file);
      const data = response.data;

      alert(
        `匯入完成：新增 ${data.createdCount} 筆，略過 ${data.skippedCount} 筆，失敗 ${data.failedCount} 筆`,
      );
      await fetchArts();
    } catch (error) {
      console.error('匯入作品失敗：', error);
      alert('匯入失敗');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>作品管理</h1>

        <div className="action-buttons">
          <label className="btn btn-secondary">
            {isImporting ? '匯入中...' : '匯入作品'}
            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              disabled={isImporting}
              onChange={handleImport}
            />
          </label>

          <button
            className="btn btn-add"
            onClick={() => navigate(adminPath('arts/create'))}
          >
            ＋ 新增作品
          </button>
        </div>
      </div>
      <table className="admin-table admin-table-fixed">
        <thead>
          <tr>
            <th style={{ width: '6%' }}>#</th>
            <th style={{ width: '12%' }}>縮圖</th>
            <th style={{ width: '34%' }}>作品名稱</th>
            <th style={{ width: '22%' }}>作者</th>
            <th style={{ width: '10%' }}>狀態</th>
            <th style={{ width: '16%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {arts.length === 0 ? (
            <tr>
              <td colSpan="6">目前沒有作品資料</td>
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
