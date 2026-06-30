import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getAuthorById } from '../api/authorsApi';

import Layout from '../layouts/Layout';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import '../styles/pages/authorDetail.css';

function AuthorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthor();
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const response = await getAuthorById(id);

      setAuthor(response.data);
    } catch (error) {
      console.error('取得作者失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="author-detail-container">
          <h2>載入中...</h2>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <div className="author-detail-container">
          <h2>找不到作者</h2>

          <button className="back-btn" onClick={() => navigate('/authors')}>
            返回作者列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="author-detail-container">
        {/* 作者基本資料 */}
        <section className="author-profile">
          <div className="author-image">
            <img src={author.avatarUrl} alt={author.name} />
          </div>

          <div className="author-info">
            <h1>{author.name}</h1>

            <h3>{author.title}</h3>

            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(author.description),
              }}
            />

            <Link
              to={`/works?author=${author.name}`}
              className="author-work-btn"
            >
              查看作品
            </Link>
          </div>
        </section>

        {/* 返回 */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 返回作者列表
        </button>
      </div>
    </Layout>
  );
}

export default AuthorDetail;
