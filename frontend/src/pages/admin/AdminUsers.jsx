import '../../styles/admin/adminUsers.css';

function AdminUsers() {
  const adminList = [
    {
      id: 1,
      name: 'WeiChun',
      account: 'admin',
      role: 'Super Admin',
      status: '啟用',
    },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-title">管理者列表</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>帳號</th>
            <th>權限</th>
            <th>狀態</th>
          </tr>
        </thead>

        <tbody>
          {adminList.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.account}</td>
              <td>{admin.role}</td>
              <td>{admin.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
