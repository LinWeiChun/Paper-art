import { useState } from 'react';

import { useEffect } from 'react';
import { getContact, updateContact } from '../../../api/contactApi';
import { createDefaultContactForm } from '../../../constants/pageDefaults';
import { displayAuditUser } from '../../../utils/audit';
import '../../../styles/admin/adminForm.css';

function AdminContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(createDefaultContactForm);
  const [auditData, setAuditData] = useState({
    createdBy: null,
    updatedBy: null,
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await getContact();

      setFormData({
        contactPerson: response.data.contactPerson || '',
        phone: response.data.phone || '',
        mobile: response.data.mobile || '',
        email: response.data.email || '',
        address: response.data.address || '',
        facebook: response.data.facebook || '',
        instagram: response.data.instagram || '',
        line: response.data.line || '',
        website: response.data.website || '',
        businessHours: response.data.businessHours || '',
        googleMap: response.data.googleMap || '',
      });
      setAuditData({
        createdBy: response.data.createdBy || null,
        updatedBy: response.data.updatedBy || null,
      });
    } catch (error) {
      console.error('取得聯絡資訊失敗：', error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await updateContact(formData);

      alert('儲存成功');
      await fetchContact();
    } catch (error) {
      console.error(error);
      alert('儲存失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1>聯絡資訊維護</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>聯絡人</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>公司電話</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>手機號碼</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>地址</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Facebook</label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>LINE</label>
          <input
            type="text"
            name="line"
            value={formData.line}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>官方網站</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>營業時間</label>
          <input
            type="text"
            name="businessHours"
            value={formData.businessHours}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Google Map 嵌入網址</label>
          <textarea
            rows="4"
            name="googleMap"
            value={formData.googleMap}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>建立者</label>
          <input value={displayAuditUser(auditData.createdBy)} readOnly />
        </div>

        <div className="form-group">
          <label>更新者</label>
          <input value={displayAuditUser(auditData.updatedBy)} readOnly />
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-add" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminContact;
