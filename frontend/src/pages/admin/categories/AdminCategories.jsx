import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteCategory, getAdminCategories } from '../../../api/categoryApi';

import Pagination from '../../../components/common/Pagination';
import '../../../styles/admin/adminTable.css';

const ITEMS_PER_PAGE = 10;

function AdminCategories() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    setSearchParams({
      page: currentPage.toString(),
    });
  }, [currentPage, setSearchParams]);

  const fetchCategories = async () => {
    try {
      const response = await getAdminCategories(
        currentPage - 1,
        ITEMS_PER_PAGE,
      );

      setCategories(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得分類失敗：', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此分類嗎？')) return;

    try {
      await deleteCategory(id);

      alert('刪除成功');

      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error('刪除失敗：', error);
      alert('刪除失敗');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>分類管理</h1>

        <button
          className="btn btn-add"
          onClick={() => navigate('/admin/categories/create')}
        >
          ＋ 新增分類
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '50%' }}>分類名稱</th>
            <th style={{ width: '15%' }}>排序</th>
            <th style={{ width: '25%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-data">
                目前沒有分類資料
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category.id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                <td title={category.name}>{category.name}</td>

                <td>{category.sortOrder}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() =>
                        navigate(`/admin/categories/edit/${category.id}`, {
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
                      onClick={() => handleDelete(category.id)}
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

export default AdminCategories;
