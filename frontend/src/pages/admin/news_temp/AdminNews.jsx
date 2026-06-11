import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminTable.css';

function AdminNews() {
  const navigate = useNavigate();
  const newsList = [
    {
      id: 1,
      title: '2026 春季剪紙展',
      date: '2026-03-15',
    },
    {
      id: 2,
      title: '剪紙藝術體驗課',
      date: '2026-06-20',
    },
    {
      id: 3,
      title: '文化傳承講座',
      date: '2026-08-10',
    },
  ];
  const handleDelete = (id) => {
    console.log(id);

    if (window.confirm('確定刪除？')) {
      alert('刪除成功');
    }
  };
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>最新消息管理</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/news/create')}
        >
          ＋ 新增消息
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>標題</th>
            <th>日期</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {newsList.map((news) => (
            <tr key={news.id}>
              <td>{news.id}</td>
              <td>{news.title}</td>
              <td>{news.date}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/news/edit/${news.id}`)}
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
    </div>
  );
}

export default AdminNews;
