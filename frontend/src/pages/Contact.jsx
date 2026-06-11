import Layout from '../layouts/Layout';
import '../styles/pages/contact.css';

function Contact() {
  return (
    <Layout>
      <div className="contact-container">
        <section className="page-banner contact-banner">
          <h1>聯絡我們</h1>
          <p>歡迎與我們交流剪紙藝術相關資訊</p>
        </section>

        <section className="contact-content">
          <div className="contact-info">
            <h2>聯絡資訊</h2>

            <div className="info-item">
              <h3>聯絡人</h3>
              <p>李煥章老師</p>
            </div>

            <div className="info-item">
              <h3>電話</h3>
              <p>0912-345-678</p>
            </div>

            <div className="info-item">
              <h3>Email</h3>
              <p>example@email.com</p>
            </div>

            <div className="info-item">
              <h3>地址</h3>
              <p>新北市板橋區 xxx 路 xxx 號</p>
            </div>
          </div>

          <div className="contact-form">
            <h2>留言給我們</h2>

            <form>
              <input type="text" placeholder="您的姓名" />

              <input type="email" placeholder="電子郵件" />

              <textarea rows="6" placeholder="請輸入您的訊息" />

              <button type="submit">送出訊息</button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Contact;
