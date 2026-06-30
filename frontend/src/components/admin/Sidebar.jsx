import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLoginPath, adminPath } from '../../routes/adminRoutes';
import { hasPermission } from '../../utils/permission.js';

import '../../styles/admin/sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenus, setOpenMenus] = useState({
    網站內容: true,
    表單填寫: false,
    系統管理: false,
  });

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('roles');

    navigate(adminLoginPath());
  };

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menus = [
    {
      title: '網站內容',
      items: [
        hasPermission('BANNER_MANAGE') && {
          name: '首頁輪播',
          path: adminPath('banners'),
        },

        hasPermission('ABOUT_MANAGE') && {
          name: '關於我們',
          path: adminPath('about'),
        },

        hasPermission('NEWS_MANAGE') && {
          name: '最新消息',
          path: adminPath('news'),
        },

        hasPermission('AUTHOR_MANAGE') && {
          name: '作者管理',
          path: adminPath('authors'),
        },

        hasPermission('CATEGORY_MANAGE') && {
          name: '分類管理',
          path: adminPath('categories'),
        },

        hasPermission('ART_MANAGE') && {
          name: '作品管理',
          path: adminPath('arts'),
        },

        hasPermission('CONTACT_MESSAGE_MANAGE') && {
          name: '聯絡我們',
          path: adminPath('contact'),
        },
      ].filter(Boolean),
    },

    {
      title: '表單填寫',
      items: [
        hasPermission('CONTACT_MANAGE') && {
          name: '聯絡訊息',
          path: adminPath('contact-message'),
        },

        hasPermission('RENTAL_MANAGE') && {
          name: '租借申請',
          path: adminPath('rentals'),
        },
      ].filter(Boolean),
    },

    {
      title: '系統管理',
      items: [
        hasPermission('USER_MANAGE') && {
          name: '使用者管理',
          path: adminPath('users'),
        },
      ].filter(Boolean),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Paper Art</h2>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link
            to={adminPath()}
            className={location.pathname === adminPath() ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>

        {menus
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <li key={group.title} className="sidebar-group">
              <div
                className="sidebar-group-title"
                onClick={() => toggleMenu(group.title)}
              >
                <span>{group.title}</span>

                {openMenus[group.title] ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </div>

              {openMenus[group.title] && (
                <ul className="sidebar-submenu">
                  {group.items.map((menu) => (
                    <li key={menu.path}>
                      <Link
                        to={menu.path}
                        className={
                          location.pathname.startsWith(menu.path)
                            ? 'active'
                            : ''
                        }
                      >
                        {menu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
