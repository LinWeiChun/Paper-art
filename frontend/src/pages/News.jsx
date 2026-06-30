import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getAllNews } from '../api/newsApi';
import Pagination from '../components/common/Pagination';
import Layout from '../layouts/Layout';
import { sanitizeHtml } from '../utils/sanitizeHtml';

import '../styles/pages/news.css';

function News() {
  const [newsList, setNewsList] = useState([]);

  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      const response = await getAllNews(
        currentPage - 1,
        9, // 每頁 9 筆
      );
      setNewsList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得最新消息失敗：', error);
    }
  };

  return (
    <Layout>
      <div className="news-container">
        {/* Banner */}
        {/* <section className="page-banner news-banner">
          <h1>最新消息</h1>
          <p>展覽、課程與最新公告資訊</p>
        </section> */}

        {/* News List */}
        <section className="news-list">
          {newsList?.length === 0 ? (
            <p>目前沒有最新消息</p>
          ) : (
            newsList.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                state={{ page: currentPage }}
                className="news-card"
              >
                <img
                  src={item.coverImage || '/images/default-news.jpg'}
                  alt={item.title}
                />

                <div className="news-content">
                  <span className="news-date">
                    {new Date(item.publishDate).toLocaleDateString('zh-TW')}
                  </span>

                  <h2>{item.title}</h2>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(item.summary),
                    }}
                  />
                </div>
              </Link>
            ))
          )}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}

export default News;
