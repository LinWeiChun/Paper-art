import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getAllAuthors } from '../api/authorsApi';
import Pagination from '../components/common/Pagination';
import Layout from '../layouts/Layout';

import '../styles/pages/authors.css';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAuthors();
  }, [currentPage]);

  const fetchAuthors = async () => {
    try {
      const response = await getAllAuthors(currentPage - 1, 6);

      setAuthors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('取得作者失敗：', error);
    }
  };

  return (
    <Layout>
      <div className="authors-container">
        <section className="page-banner authors-banner">
          <h1>作者介紹</h1>
          <p>探索每位藝術家的創作故事</p>
        </section>

        <section className="authors-grid">
          {authors.map((author) => (
            <Link
              key={author.id}
              to={`/authors/${author.id}`}
              className="author-card"
            >
              <img src={author.avatarUrl} alt={author.name} />

              <div className="author-card-content">
                <h2>{author.name}</h2>

                <p>{author.title}</p>
              </div>
            </Link>
          ))}
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

export default Authors;
