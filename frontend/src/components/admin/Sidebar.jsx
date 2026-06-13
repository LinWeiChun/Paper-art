import { Link, useLocation, useNavigate } from 'react-router-dom';

import '../../styles/admin/sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const menus = [
    {
      name: 'Dashboard',
      path: '/admin',
    },
    {
      name: '使用者管理',
      path: '/admin/users',
    },
    {
      name: '關於我們',
      path: '/admin/about',
    },
    {
      name: '最新消息',
      path: '/admin/news',
    },
    {
      name: '作者管理',
      path: '/admin/authors',
    },
    {
      name: '分類管理',
      path: '/admin/categories',
    },
    {
      name: '作品管理',
      path: '/admin/arts',
    },
    {
      name: '聯絡我們',
      path: '/admin/contact',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Paper Art</h2>
      </div>

      <ul className="sidebar-menu">
        {menus.map((menu) => (
          <li key={menu.path}>
            <Link
              to={menu.path}
              className={location.pathname === menu.path ? 'active' : ''}
            >
              {menu.name}
            </Link>
          </li>
        ))}

        <li className="logout-item">
          <button className="logout-btn" onClick={handleLogout}>
            登出
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
