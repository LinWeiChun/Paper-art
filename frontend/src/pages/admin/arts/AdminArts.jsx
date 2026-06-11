import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminTable.css';

function AdminArts() {
  const navigate = useNavigate();

  const artList = [
    {
      id: 1,
      title: '春之剪影',
      category: '傳統剪紙',
      author: '王小明',
      date: '2026-03-15',
    },
    {
      id: 2,
      title: '福氣滿堂',
      category: '吉祥剪紙',
      author: '陳美玲',
      date: '2026-05-20',
    },
    {
      id: 3,
      title: '花開富貴',
      category: '花卉系列',
      author: '王小明',
      date: '2026-08-10',
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除此作品嗎？')) {
      console.log('刪除作品 ID：', id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>作品管理</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/arts/create')}
        >
          ＋ 新增作品
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>作品名稱</th>
            <th>分類</th>
            <th>作者</th>
            <th>建立日期</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {artList.map((art) => (
            <tr key={art.id}>
              <td>{art.id}</td>
              <td>{art.title}</td>
              <td>{art.category}</td>
              <td>{art.author}</td>
              <td>{art.date}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/arts/edit/${art.id}`)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminArts;
