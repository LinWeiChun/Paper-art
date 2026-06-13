import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../../../styles/admin/adminTable.css';

function AdminContact() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: '王小明',
      email: 'test@gmail.com',
      subject: '合作邀約',
      createdAt: '2026-06-12',
      status: '未處理',
    },
    {
      id: 2,
      name: '陳小姐',
      email: 'abc@yahoo.com',
      subject: '課程問題',
      createdAt: '2026-06-11',
      status: '處理中',
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setContacts(
      contacts.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );
  };

  return (
    <div className="admin-table-container">
      <h1>聯絡表單管理</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>Email</th>
            <th>主旨</th>
            <th>日期</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.subject}</td>
              <td>{item.createdAt}</td>

              <td>
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
              </td>

              <td>
                <Link to={`/admin/contact/${item.id}`} className="btn btn-edit">
                  查看詳情
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminContact;
