import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/authors.css';

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
  ];

  return (
    <>
      <Header />

      <div className="authors-container">
        <section className="authors-banner">
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
              <img src={author.image} alt={author.name} />

              <div className="author-card-content">
                <h2>{author.name}</h2>
                <p>{author.summary}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Authors;