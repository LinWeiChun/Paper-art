import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

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
