import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import works from '../data/works';

import '../styles/works.css';

function Works() {
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchParams] = useSearchParams();

  const defaultAuthor = searchParams.get('author');

  const [selectedAuthors, setSelectedAuthors] = useState(
    defaultAuthor ? [defaultAuthor] : [],
  );

  // 取得所有分類
  const categories = [...new Set(works.flatMap((work) => work.categories))];

  // 取得所有作者
  const authors = [...new Set(works.flatMap((work) => work.authors))];

  // 分類勾選
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  // 作者勾選
  const handleAuthorChange = (author) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((item) => item !== author)
        : [...prev, author],
    );
  };

  // 篩選作品
  const filteredWorks = works.filter((work) => {
    const matchSearch = work.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) => work.categories.includes(category));

    const matchAuthor =
      selectedAuthors.length === 0 ||
      selectedAuthors.some((author) => work.authors.includes(author));

    return matchSearch && matchCategory && matchAuthor;
  });

  return (
    <>
      <Header />

      <div className="works-container">
        <section className="works-banner">
          <h1>作品集</h1>
          <p>探索剪紙藝術作品</p>
        </section>

        {/* 搜尋列 */}
        <section className="works-toolbar">
          <input
            type="text"
            placeholder="搜尋作品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <button className="filter-btn" onClick={() => setShowFilter(true)}>
            篩選
          </button>
        </section>

        {/* 篩選 Drawer */}
        {showFilter && (
          <>
            <div
              className="filter-overlay"
              onClick={() => setShowFilter(false)}
            />
            <div className="filter-modal">
              <button
                className="close-btn"
                onClick={() => setShowFilter(false)}
              >
                ✕
              </button>
              <h2>篩選條件</h2>

              {/* 分類 */}
              <div className="filter-group">
                <h3>分類</h3>

                {categories.map((category) => (
                  <label key={category} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />

                    <span>{category}</span>
                  </label>
                ))}
              </div>

              {/* 作者 */}
              <div className="filter-group">
                <h3>作者</h3>

                {authors.map((author) => (
                  <label key={author} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedAuthors.includes(author)}
                      onChange={() => handleAuthorChange(author)}
                    />

                    <span>{author}</span>
                  </label>
                ))}
              </div>

              <div className="filter-actions">
                <button
                  className="reset-btn"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedAuthors([]);
                    setSearch('');
                  }}
                >
                  清除篩選
                </button>

                <button
                  className="apply-btn"
                  onClick={() => setShowFilter(false)}
                >
                  套用篩選
                </button>
              </div>
            </div>
          </>
        )}

        {/* 作品列表 */}
        <section className="works-grid">
          {filteredWorks.map((work) => (
            <Link key={work.id} to={`/works/${work.id}`} className="work-card">
              <img src={work.image} alt={work.title} />

              <div className="work-content">
                <h3>{work.title}</h3>

                <p>{work.authors.join('、')}</p>

                <div className="work-tags">
                  {work.categories.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
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
