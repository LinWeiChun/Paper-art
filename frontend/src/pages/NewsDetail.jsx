import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/newsDetail.css';

function NewsDetail() {
  const { id } = useParams();

  const newsData = {
    1: {
      title: '2026 春季剪紙展',
      date: '2026-03-15',
      image: '/images/news1.jpg',
      content: `
李煥章老師將於 2026 春季舉辦個人剪紙藝術展，
展出近年代表作品與珍貴收藏。

歡迎對傳統藝術有興趣的民眾蒞臨參觀，
共同感受剪紙藝術的魅力。
      `,
    },

    2: {
      title: '剪紙藝術體驗課',
      date: '2026-06-20',
      image: '/images/news2.jpg',
      content: `
本次課程將由老師親自指導，
帶領學員從基礎開始認識剪紙藝術。

課程適合所有年齡層參加，
歡迎親子共同報名。
      `,
    },

    3: {
      title: '文化傳承講座',
      date: '2026-08-10',
      image: '/images/news3.jpg',
      content: `
講座將介紹剪紙藝術的歷史發展、
文化意涵與現代應用。

歡迎喜愛傳統文化的朋友一同參與交流。
      `,
    },
  };

  const news = newsData[id];

  if (!news) {
    return (
      <>
        <Header />
        <div className="news-detail-container">
          <h1>找不到此消息</h1>

          <Link to="/news" className="back-btn">
            返回最新消息
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="news-detail-container">
        <img
          src={news.image}
          alt={news.title}
          className="news-detail-image"
        />

        <div className="news-detail-content">
          <span className="news-detail-date">
            {news.date}
          </span>

          <h1>{news.title}</h1>

          <p>{news.content}</p>

          <Link to="/news" className="back-btn">
            ← 返回最新消息
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default NewsDetail;