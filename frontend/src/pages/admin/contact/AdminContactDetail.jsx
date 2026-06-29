import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getContactMessageById,
  updateContactMessageProcessed,
} from '../../../api/contactApi';

import '../../../styles/admin/adminForm.css';

function AdminContactDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [processed, setProcessed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContactMessage();
  }, [id]);

  const fetchContactMessage = async () => {
    try {
      setLoading(true);

      const response = await getContactMessageById(id);

      setContact(response.data);
      setProcessed(Boolean(response.data.processed));
    } catch (error) {
      console.error('取得聯絡訊息失敗：', error);
      alert('取得資料失敗');
      navigate('/admin/contact-message');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await updateContactMessageProcessed(id, processed);

      alert('更新成功');
      navigate('/admin/contact-message');
    } catch (error) {
      console.error('更新聯絡訊息失敗：', error);
      alert('更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !contact) {
    return <div>載入中...</div>;
  }

  return (
    <div className="admin-form-container">
      <h1>聯絡表單詳細資料</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>姓名</label>
          <input value={contact.name || ''} readOnly />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={contact.email || ''} readOnly />
        </div>

        <div className="form-group">
          <label>電話</label>
          <input value={contact.phone || ''} readOnly />
        </div>

        <div className="form-group">
          <label>主旨</label>
          <input value={contact.subject || ''} readOnly />
        </div>

        <div className="form-group">
          <label>訊息內容</label>
          <textarea rows="8" value={contact.message || ''} readOnly />
        </div>

        <div className="form-group">
          <label>送出時間</label>
          <input value={contact.createdAt?.replace('T', ' ') || ''} readOnly />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={processed}
              onChange={(e) => setProcessed(e.target.checked)}
            />
            已處理
          </label>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/contact-message')}
          >
            返回列表
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminContactDetail;
