import { Link } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import usePagination from '../hooks/usePagination';
import Layout from '../layouts/Layout';
import '../styles/pages/authors.css';

function Authors() {
  const authors = [
    {
      id: 1,
      name: '李煥章',
      image: '/images/author1.jpg',
      summary: '傳統剪紙藝術家',
    },
    {
      id: 2,
      name: '王小明',
      image: '/images/author2.jpg',
      summary: '現代紙雕創作者',
    },
    {
      id: 3,
      name: '陳大文',
      image: '/images/author3.jpg',
      summary: '民俗剪紙創作者',
    },
    {
      id: 4,
      name: '林美華',
      image: '/images/author4.jpg',
      summary: '紙雕藝術設計師',
    },
  ];

  const {
    currentPage,
    totalPages,
    pagedData: pagedAuthors,
    handlePageChange,
  } = usePagination(authors, 6);

  return (
    <Layout>
      <div className="authors-container">
        <section className="page-banner authors-banner">
          <h1>作者介紹</h1>
          <p>探索每位藝術家的創作故事</p>
        </section>

        <section className="authors-grid">
          {pagedAuthors.map((author) => (
            <Link
              key={author.id}
              to={`/authors/${author.id}`}
              className="author-card"
            >
              <img src={author.image} alt={author.name} />

              <div className="author-card-content">
                <h2>{author.name}</h2>
                <p>{author.summary}</p>
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

export default Authors;
