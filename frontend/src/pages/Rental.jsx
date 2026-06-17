import { Link } from 'react-router-dom';

import Layout from '../layouts/Layout';
import '../styles/pages/rental.css';

function Rental() {
  const rentalItems = [
    {
      title: '展覽作品租借',
      description: '提供剪紙作品短期展出、藝文活動、文化節慶等租借服務。',
    },
    {
      title: '企業空間佈置',
      description: '適合企業大廳、會議空間、接待區等藝術展示需求。',
    },
    {
      title: '文化活動合作',
      description: '配合學校、社區、博物館及藝文單位辦理展覽活動。',
    },
  ];

  return (
    <Layout>
      <div className="rental-container">
        {/* Banner */}
        <section className="page-banner rental-banner">
          <h1>作品租借</h1>
          <p>提供展覽、企業空間及文化活動之作品租借服務</p>
        </section>

        {/* 介紹 */}
        <section className="rental-intro">
          <span className="section-tag">ART RENTAL</span>

          <h2>讓傳統剪紙走入更多空間</h2>

          <p>
            我們提供多件剪紙藝術作品租借服務，
            適合展覽活動、企業空間佈置、文化推廣與教育展示。
          </p>

          <p>如有長期合作需求，也歡迎與我們聯繫討論。</p>
        </section>

        {/* 租借服務 */}
        <section className="rental-service">
          <h2>租借項目</h2>

          <div className="rental-cards">
            {rentalItems.map((item, index) => (
              <div className="rental-card" key={index}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 流程 */}
        <section className="rental-process">
          <h2>租借流程</h2>

          <div className="process-list">
            <div className="process-item">
              <span>01</span>
              <h3>聯絡洽詢</h3>
              <p>提供活動需求與展出日期。</p>
            </div>

            <div className="process-item">
              <span>02</span>
              <h3>作品確認</h3>
              <p>依需求提供適合之作品。</p>
            </div>

            <div className="process-item">
              <span>03</span>
              <h3>安排租借</h3>
              <p>確認時間與租借內容。</p>
            </div>

            <div className="process-item">
              <span>04</span>
              <h3>完成展出</h3>
              <p>展覽結束後歸還作品。</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rental-contact">
          <h2>歡迎洽詢作品租借</h2>

          <p>
            若有展覽、企業空間或文化活動需求， 歡迎透過聯絡我們頁面與我們聯繫。
          </p>

          <Link to="/rental/works" className="contact-btn">
            填寫申請表單
          </Link>
        </section>
      </div>
    </Layout>
  );
}

export default Rental;
