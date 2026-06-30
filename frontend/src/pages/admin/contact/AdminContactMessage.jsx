import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getContactMessages } from '../../../api/contactApi';
import Pagination from '../../../components/common/Pagination';
import { ADMIN_ITEMS_PER_PAGE } from '../../../constants/pageDefaults';
import { adminPath } from '../../../routes/adminRoutes';

import '../../../styles/admin/adminTable.css';

function AdminContactMessage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await getContactMessages(
        currentPage - 1,
        ADMIN_ITEMS_PER_PAGE,
      );

      setMessages(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得聯絡訊息失敗：', error);
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

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>聯絡表單管理</h1>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>#</th>
            <th style={{ width: '16%' }}>姓名</th>
            <th style={{ width: '22%' }}>Email</th>
            <th style={{ width: '20%' }}>主旨</th>
            <th style={{ width: '16%' }}>送出時間</th>
            <th style={{ width: '10%' }}>狀態</th>
            <th style={{ width: '8%' }}>操作</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((item, index) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * ADMIN_ITEMS_PER_PAGE + index + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.subject}</td>
              <td>{item.createdAt?.slice(0, 10)}</td>
              <td>
                <span
                  className={
                    item.processed ? 'status-enable' : 'status-disable'
                  }
                >
                  {item.processed ? '已處理' : '未處理'}
                </span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() =>
                    navigate(adminPath(`contact-message/${item.id}`))
                  }
                >
                  查看
                </button>
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

export default AdminContactMessage;
