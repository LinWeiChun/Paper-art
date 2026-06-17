import Layout from '../layouts/Layout';
import '../styles/pages/contact.css';

function Contact() {
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
          <section className="contact-info-section">
            <div className="contact-card">
              <h3>聯絡人</h3>
              <p>李煥章老師</p>
            </div>

            <div className="contact-card">
              <h3>電話</h3>
              <p>0912-345-678</p>
            </div>

            <div className="contact-card">
              <h3>Email</h3>
              <p>example@email.com</p>
            </div>

            <div className="contact-card">
              <h3>地址</h3>
              <p>新北市板橋區 xxx 路 xxx 號</p>
            </div>
          </section>

          {/* 表單 */}
          <section className="contact-form-section">
            <h2>留言給我們</h2>

            <form>
              <input type="text" placeholder="您的姓名" />

              <input type="email" placeholder="電子郵件" />

              {/* 主旨選單 */}
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
