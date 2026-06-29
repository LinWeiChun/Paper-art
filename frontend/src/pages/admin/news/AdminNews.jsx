import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteNews, getAllNews } from '../../../api/newsApi';
import Pagination from '../../../components/common/Pagination';
import { ADMIN_ITEMS_PER_PAGE } from '../../../constants/pageDefaults';

import '../../../styles/admin/adminTable.css';

function AdminNews() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      const response = await getAllNews(currentPage - 1, ADMIN_ITEMS_PER_PAGE);

      console.log(response.data);
      setNewsList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error(error);
      alert('取得資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    setSearchParams({
      page,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定刪除？')) {
      return;
    }

    try {
      await deleteNews(id);

      alert('刪除成功');

      fetchNews();
    } catch (error) {
      console.error(error);

      alert('刪除失敗');
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>最新消息管理</h1>

        <button
          className="btn btn-add"
          onClick={() => navigate('/admin/news/create')}
        >
          ＋ 新增消息
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>#</th>
            <th style={{ width: '52%' }}>標題</th>
            <th style={{ width: '20%' }}>日期</th>
            <th style={{ width: '20%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {newsList.map((news, index) => (
            <tr key={news.id}>
              <td>{(currentPage - 1) * ADMIN_ITEMS_PER_PAGE + index + 1}</td>

              <td>{news.title}</td>

              <td>{news.publishDate}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      navigate(`/admin/news/edit/${news.id}`, {
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
                    onClick={() => handleDelete(news.id)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminNews;
