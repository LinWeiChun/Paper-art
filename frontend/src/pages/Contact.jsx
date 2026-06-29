import { useEffect, useState } from 'react';

import { getContact, submitContactMessage } from '../api/contactApi';
import {
  createDefaultContactForm,
  createDefaultContactMessageForm,
} from '../constants/pageDefaults';
import Layout from '../layouts/Layout';

import '../styles/pages/contact.css';

function Contact() {
  const [contact, setContact] = useState(createDefaultContactForm);
  const [formData, setFormData] = useState(createDefaultContactMessageForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await getContact();
      setContact(response.data || {});
    } catch (error) {
      console.error('取得聯絡資訊失敗：', error);
    }
  };

  const hasContactInfo = [
    contact.contactPerson,
    contact.phone,
    contact.mobile,
    contact.email,
    contact.address,
    contact.facebook,
    contact.instagram,
    contact.line,
    contact.website,
    contact.businessHours,
    contact.googleMap,
  ].some(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert('請填寫姓名、電子郵件、主旨與訊息');
      return;
    }

    try {
      setIsSubmitting(true);

      await submitContactMessage(formData);

      alert('訊息已送出，我們會盡快與您聯繫');
      setFormData(createDefaultContactMessageForm());
    } catch (error) {
      console.error('送出聯絡訊息失敗：', error);
      alert('送出失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="contact-container">
        {/* Banner */}
        {/* <section className="page-banner contact-banner">
          <h1>聯絡我們</h1>
          <p>歡迎與我們交流剪紙藝術、展覽合作與課程資訊</p>
        </section> */}

        <div className="contact-content">
          {/* 聯絡資訊 */}
          {hasContactInfo && (
            <section className="contact-info-section">
              <h2>聯絡資訊</h2>

              {contact.contactPerson && (
                <div className="info-row">
                  <span>聯絡人</span>
                  <p>{contact.contactPerson}</p>
                </div>
              )}

              {contact.phone && (
                <div className="info-row">
                  <span>公司電話</span>
                  <p>{contact.phone}</p>
                </div>
              )}

              {contact.mobile && (
                <div className="info-row">
                  <span>手機</span>
                  <p>{contact.mobile}</p>
                </div>
              )}

              {contact.email && (
                <div className="info-row">
                  <span>Email</span>
                  <p>{contact.email}</p>
                </div>
              )}

              {contact.address && (
                <div className="info-row">
                  <span>地址</span>
                  <p>{contact.address}</p>
                </div>
              )}

              {contact.website && (
                <div className="info-row">
                  <span>官方網站</span>
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.website}
                  </a>
                </div>
              )}

              {contact.businessHours && (
                <div className="info-row">
                  <span>營業時間</span>
                  <p>{contact.businessHours}</p>
                </div>
              )}

              {(contact.facebook || contact.instagram || contact.line) && (
                <div className="info-row">
                  <span>社群平台</span>

                  <div className="social-links">
                    {contact.facebook && (
                      <a
                        href={contact.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    )}

                    {contact.instagram && (
                      <a
                        href={contact.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    )}

                    {contact.line && (
                      <a
                        href={contact.line}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LINE
                      </a>
                    )}
                  </div>
                </div>
              )}

              {contact.googleMap && (
                <div className="map-wrapper">
                  <iframe
                    src={contact.googleMap}
                    title="Google Map"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
            </section>
          )}

          {/* 聯絡表單 */}
          <section className="contact-form-section">
            <h2>留言給我們</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="您的姓名"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="電子郵件"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="聯絡電話"
                value={formData.phone}
                onChange={handleChange}
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">請選擇主旨</option>
                <option value="課程資訊">課程資訊</option>
                <option value="展覽合作">展覽合作</option>
                <option value="作品租借">作品租借</option>
                <option value="媒體採訪">媒體採訪</option>
                <option value="其他">其他</option>
              </select>

              <textarea
                rows="6"
                name="message"
                placeholder="請輸入您的訊息"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '送出中...' : '送出訊息'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
