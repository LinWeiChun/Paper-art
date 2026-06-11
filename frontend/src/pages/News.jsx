import usePagination from '../hooks/usePagination';

import '../styles/pages/news.css';

function News() {
  const newsList = [
    {
      id: 1,
      title: '2026 春季剪紙展',
      date: '2026-03-15',
      image: '/images/news1.jpg',
      summary: '展出老師近年代表作品。',
    },
    {
      id: 2,
      title: '剪紙藝術體驗課',
      date: '2026-06-20',
      image: '/images/news2.jpg',
      summary: '歡迎大小朋友共同參與。',
    },
    {
      id: 3,
      title: '文化傳承講座',
      date: '2026-08-10',
      image: '/images/news3.jpg',
      summary: '分享剪紙藝術發展歷程。',
    },
    {
      id: 4,
      title: '年度作品發表',
      date: '2026-10-01',
      image: '/images/news4.jpg',
      summary: '公開最新創作作品。',
    },
    {
      id: 5,
      title: '校園巡迴展',
      date: '2026-11-15',
      image: '/images/news5.jpg',
      summary: '推廣剪紙藝術教育。',
    },
  ];

  const {
    currentPage,
    totalPages,
    pagedData: pagedNews,
    handlePageChange,
  } = usePagination(newsList, 6);

  return (
    <Layout>
      <div className="news-container">
        {/* Banner */}
        <section className="page-banner news-banner">
          <h1>最新消息</h1>
          <p>展覽、課程與最新公告資訊</p>
        </section>

        {/* 消息列表 */}
        <section className="news-list">
          {pagedNews.map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="news-card">
              <img src={item.image} alt={item.title} />

              <div className="news-content">
                <span className="news-date">{item.date}</span>

                <h2>{item.title}</h2>

                <p>{item.summary}</p>
              </div>
            </Link>
          ))}
        </section>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}

export default News;
