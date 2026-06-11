

import '../../styles/admin/adminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
