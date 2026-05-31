import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/news.css';

function News() {
  const newsList = [
    {
      id: 1,
      title: '2026 春季剪紙展',
      date: '2026-03-15',
      image: '/images/news1.jpg',
      summary: '展出老師近年代表作品。'
    },
    {
      id: 2,
      title: '剪紙藝術體驗課',
      date: '2026-06-20',
      image: '/images/news2.jpg',
      summary: '歡迎大小朋友共同參與。'
    },
    {
      id: 3,
      title: '文化傳承講座',
      date: '2026-08-10',
      image: '/images/news3.jpg',
      summary: '分享剪紙藝術發展歷程。'
    }
  ];

  return (
    <>
      <Header />

      <div className="news-container">
        <section className="news-banner">
          <h1>最新消息</h1>
          <p>展覽、課程與最新公告資訊</p>
        </section>

        <section className="news-list">
          {newsList.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="news-card"
            >
              <img
                src={item.image}
                alt={item.title}
              />

              <div className="news-content">
                <span className="news-date">
                  {item.date}
                </span>

                <h2>{item.title}</h2>

                <p>{item.summary}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
}

export default News;