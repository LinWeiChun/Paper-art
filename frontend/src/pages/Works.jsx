import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/works.css';
import works from '../data/works';

function Works() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedAuthor, setSelectedAuthor] = useState('全部');

  const categories = [
    '全部',
    ...new Set(works.flatMap((work) => work.categories)),
  ];

  const authors = ['全部', ...new Set(works.flatMap((work) => work.authors))];

  const filteredWorks = works.filter((work) => {
    const matchSearch = work.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === '全部' || work.categories.includes(selectedCategory);

    const matchAuthor =
      selectedAuthor === '全部' || work.authors.includes(selectedAuthor);

    return matchSearch && matchCategory && matchAuthor;
  });

  return (
    <>
      <Header />

      <div className="works-container">
        <section className="works-banner">
          <h1>作品集</h1>
          <p>探索剪紙藝術之美</p>
        </section>

        {/* 搜尋 */}
        <div className="search-area">
          <input
            type="text"
            placeholder="搜尋作品名稱..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 類別 */}
        <div className="filter-section">
          <h3>作品分類</h3>

          <div className="filter-tags">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? 'filter-tag active'
                    : 'filter-tag'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 作者 */}
        <div className="filter-section">
          <h3>作者</h3>

          <div className="filter-tags">
            {authors.map((author) => (
              <button
                key={author}
                className={
                  selectedAuthor === author ? 'filter-tag active' : 'filter-tag'
                }
                onClick={() => setSelectedAuthor(author)}
              >
                {author}
              </button>
            ))}
          </div>
        </div>

        {/* 作品列表 */}
        <section className="works-grid">
          {filteredWorks.map((work) => (
            <Link key={work.id} to={`/works/${work.id}`} className="work-card">
              <img src={work.image} alt={work.title} />

              <div className="work-content">
                <h2>{work.title}</h2>

                <div className="work-tags">
                  {work.categories.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <p>{work.authors.join('、')}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Works;
