import { useNavigate } from 'react-router-dom';

import '../../../styles/admin/adminTable.css';

function AdminCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: '傳統剪紙',
    },
    {
      id: 2,
      name: '紙雕藝術',
    },
    {
      id: 3,
      name: '生肖系列',
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除此分類嗎？')) {
      console.log('刪除分類：', id);
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
            <th>ID</th>
            <th>分類名稱</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>

              <td>{category.name}</td>

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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;