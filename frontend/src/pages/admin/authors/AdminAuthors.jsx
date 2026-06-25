import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteAuthor, getAdminAuthors } from '../../../api/authorsApi';

import Pagination from '../../../components/common/Pagination';
import '../../../styles/admin/adminTable.css';

function AdminAuthors() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const ITEMS_PER_PAGE = 10;

  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );

  // 取得作者
  const fetchAuthors = async () => {
    try {
      const response = await getAdminAuthors(currentPage - 1, ITEMS_PER_PAGE);

      setAuthors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('取得作者失敗：', error);
    }
  };

  // 頁數改變時重新查詢
  useEffect(() => {
    fetchAuthors();
  }, [currentPage]);

  // 同步 URL
  useEffect(() => {
    setSearchParams({
      page: currentPage.toString(),
    });
  }, [currentPage, setSearchParams]);

  // 刪除作者
  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此作者嗎？')) return;

    try {
      await deleteAuthor(id);

      alert('刪除成功');

      // 若當頁只剩一筆且不是第一頁，回上一頁
      if (authors.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchAuthors();
      }
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>作者管理</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/authors/create')}
        >
          ＋ 新增作者
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>#</th>
            <th style={{ width: '35%' }}>姓名</th>
            <th style={{ width: '35%' }}>職稱</th>
            <th style={{ width: '20%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {authors.map((author, index) => (
            <tr key={author.id}>
              <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

              <td>{author.name}</td>

              <td>{author.title}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      navigate(`/admin/authors/edit/${author.id}`, {
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
                    onClick={() => handleDelete(author.id)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {authors.length === 0 && (
            <tr>
              <td colSpan="4">目前沒有資料</td>
            </tr>
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

export default AdminAuthors;
