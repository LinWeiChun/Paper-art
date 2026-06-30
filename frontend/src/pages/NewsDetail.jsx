import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getNewsById } from '../api/newsApi';

import Layout from '../layouts/Layout';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import '../styles/pages/newsDetail.css';

function NewsDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();

  const page = location.state?.page || 1;

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await getNewsById(id);

      setNews(response.data);
    } catch (error) {
      console.error('取得最新消息失敗：', error);

      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  // 載入中
  if (loading) {
    return (
      <Layout>
        <div className="news-detail-container">
          <h1>載入中...</h1>
        </div>
      </Layout>
    );
  }

  // 找不到資料
  if (!news) {
    return (
      <Layout>
        <div className="news-detail-container">
          <h1>找不到此消息</h1>

          <button className="back-btn" onClick={() => navigate('/news')}>
            返回最新消息
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="news-detail-container">
        <img
          src={news.coverImage || '/images/default-news.jpg'}
          alt={news.title}
          className="news-detail-image"
        />

        <div className="news-detail-content">
          <span className="news-detail-date">
            {new Date(news.publishDate).toLocaleDateString('zh-TW')}
          </span>

          <h1>{news.title}</h1>

          {/* 如果 content 是純文字 */}
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }}
          />
          <button
            className="back-btn"
            onClick={() => navigate(`/news?page=${page}`)}
          >
            ← 返回最新消息
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default NewsDetail;
