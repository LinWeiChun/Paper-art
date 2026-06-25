import { useEffect, useState } from 'react';

import { getContact } from '../api/contactApi';
import Layout from '../layouts/Layout';

import '../styles/pages/contact.css';

function Contact() {
  const [contact, setContact] = useState({
    contactPerson: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    line: '',
    website: '',
    businessHours: '',
    googleMap: '',
  });

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

  return (
    <Layout>
      <div className="contact-container">
        {/* Banner */}
        <section className="page-banner contact-banner">
          <h1>聯絡我們</h1>
          <p>歡迎與我們交流剪紙藝術、展覽合作與課程資訊</p>
        </section>

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

            <form>
              <input type="text" placeholder="您的姓名" />

              <input type="email" placeholder="電子郵件" />

              <select>
                <option value="">請選擇主旨</option>
                <option value="課程資訊">課程資訊</option>
                <option value="展覽合作">展覽合作</option>
                <option value="作品租借">作品租借</option>
                <option value="媒體採訪">媒體採訪</option>
                <option value="其他">其他</option>
              </select>

              <textarea rows="6" placeholder="請輸入您的訊息" />

              <button type="submit">送出訊息</button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
