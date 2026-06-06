import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminTable.css';

function AdminAuthors() {
  const navigate = useNavigate();

  const authors = [
    {
      id: 1,
      name: '李煥章',
      title: '傳統剪紙藝術家',
    },
    {
      id: 2,
      name: '王小明',
      title: '現代紙雕創作者',
    },
    {
      id: 3,
      name: '陳美玲',
      title: '民俗藝術創作者',
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除此作者嗎？')) {
      console.log('刪除作者：', id);
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
            <th>ID</th>
            <th>姓名</th>
            <th>職稱</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.name}</td>
              <td>{author.title}</td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      navigate(`/admin/authors/edit/${author.id}`)
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
        </tbody>
      </table>
    </div>
  );
}

export default AdminAuthors;