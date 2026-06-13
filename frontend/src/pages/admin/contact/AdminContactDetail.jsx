import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../../styles/admin/adminForm.css';

function AdminContactDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState({
    id,
    name: '王小明',
    email: 'test@gmail.com',
    phone: '0912-345-678',
    subject: '合作邀約',
    message: '您好，我們想邀請李煥章老師參與文化展覽活動。',
    createdAt: '2026-06-12',
    status: '未處理',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('聯絡表單資料：', contact);

    alert('修改成功');

    navigate('/admin/contact');
  };

  return (
    <div className="admin-form-container">
      <h1>聯絡表單詳細資料</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>姓名</label>
          <input value={contact.name} readOnly />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={contact.email} readOnly />
        </div>

        <div className="form-group">
          <label>電話</label>
          <input value={contact.phone} readOnly />
        </div>

        <div className="form-group">
          <label>主旨</label>
          <input value={contact.subject} readOnly />
        </div>

        <div className="form-group">
          <label>留言內容</label>
          <textarea rows="8" value={contact.message} readOnly />
        </div>

        <div className="form-group">
          <label>建立時間</label>
          <input value={contact.createdAt} readOnly />
        </div>

        <div className="form-group">
          <label>狀態</label>

          <select
            className="status-select"
            value={contact.status}
            onChange={(e) =>
              setContact({
                ...contact,
                status: e.target.value,
              })
            }
          >
            <option value="未處理">未處理</option>
            <option value="處理中">處理中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/contact')}
          >
            返回列表
          </button>

          <button type="submit" className="btn btn-primary">
            儲存
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminContactDetail;
