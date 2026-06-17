import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteCategory, getAllCategories } from '../../../api/categoryApi';

import Pagination from '../../../components/common/Pagination';
import '../../../styles/admin/adminTable.css';

const ITEMS_PER_PAGE = 10;

function AdminCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(currentPage - 1, ITEMS_PER_PAGE);

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
          className="btn btn-primary"
          onClick={() => navigate('/admin/categories/create')}
        >
          ＋ 新增分類
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>編號</th>
            <th>分類名稱</th>
            <th>排序</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4">目前沒有分類資料</td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category.id}>
                {/* 顯示流水號，不顯示 UUID */}
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                <td>{category.name}</td>

                <td>{category.sortOrder}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() =>
                        navigate(`/admin/categories/edit/${category.id}`)
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
