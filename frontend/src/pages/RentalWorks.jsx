import { Link } from 'react-router-dom';

import { useRental } from '../contexts/RentalContext';
import Layout from '../layouts/Layout';

import '../styles/pages/rentalWorks.css';

function RentalWorks() {
  const { rentalList, removeFromRental } = useRental();

  return (
    <Layout>
      <div className="rental-works-container">
        {/* Banner */}
        <section className="page-banner rental-banner">
          <h1>租借清單</h1>

          <p>已選擇 {rentalList.length} 件作品</p>
        </section>

        {rentalList.length === 0 ? (
          <div className="empty-rental">
            <h2>目前尚未加入任何作品</h2>

            <Link to="/works" className="contact-btn">
              前往作品集
            </Link>
          </div>
        ) : (
          <>
            {/* 作品列表 */}
            <section className="rental-list">
              {rentalList.map((work) => (
                <div className="rental-item" key={work.id}>
                  <img src={work.thumbnail} alt={work.title} />

                  <div className="rental-info">
                    <h3>{work.title}</h3>

                    <p>
                      作者：
                      {work.authors?.map((author) => author.name).join('、')}
                    </p>

                    <p>
                      年份：
                      {work.year || '未提供'}
                    </p>

                    {/* 分類 */}
                    {work.categories?.length > 0 && (
                      <div className="rental-tags">
                        {work.categories.map((category) => (
                          <span key={category.id}>{category.name}</span>
                        ))}
                      </div>
                    )}

                    <button
                      className="remove-btn"
                      onClick={() => removeFromRental(work.id)}
                    >
                      移除作品
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Footer */}
            <div className="rental-footer">
              <p>共 {rentalList.length} 件作品</p>

              <div className="rental-actions">
                <Link to="/works" className="action-btn secondary">
                  繼續瀏覽作品
                </Link>

                <Link to="/rental/request" className="action-btn">
                  填寫租借申請
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default RentalWorks;
