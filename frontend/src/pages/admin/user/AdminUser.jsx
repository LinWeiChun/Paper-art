import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { disableUser, enableUser, getUsers } from '../../../api/userApi';
import { adminPath } from '../../../routes/adminRoutes';

import '../../../styles/admin/adminTable.css';

function AdminUser() {
  const navigate = useNavigate();

  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      console.log(response.data);

      setAdminList(response.data || []);
    } catch (error) {
      console.error(error);
      alert('取得資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (user.enabled) {
        await disableUser(user.id);
      } else {
        await enableUser(user.id);
      }

      alert('更新成功');

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('更新失敗');
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>管理者列表</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate(adminPath('users/create'))}
        >
          ＋ 新增管理者
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>帳號</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {adminList.map((admin, index) => (
            <tr key={admin.id}>
              <td>{index + 1}</td>

              <td>{admin.username}</td>

              <td>
                {admin.enabled ? (
                  <span className="status-active">啟用</span>
                ) : (
                  <span className="status-inactive">停用</span>
                )}
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(adminPath(`users/edit/${admin.id}`))}
                  >
                    編輯
                  </button>

                  <button
                    className={
                      admin.enabled ? 'btn btn-delete' : 'btn btn-primary'
                    }
                    onClick={() => handleToggleStatus(admin)}
                  >
                    {admin.enabled ? '停用' : '啟用'}
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

export default AdminUser;
