import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import works from '../data/works';
import usePagination from '../hooks/usePagination';

import '../styles/pages/works.css';

function Works() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const toolbarRef = useRef(null);

  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);

  const selectedCategories = searchParams.getAll('category');
  const selectedAuthors = searchParams.getAll('author');

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  // 保留返回時的 scrollY
  useEffect(() => {
    if (location.state?.scrollY !== undefined) {
      window.scrollTo({
        top: location.state.scrollY,
        behavior: 'auto',
      });
    }
  }, [location.state]);

  // 更新 URL
  const updateFilters = ({
    categories = selectedCategories,
    authors = selectedAuthors,
    keyword = search,
    page = 1,
  }) => {
    const params = new URLSearchParams();

    categories.forEach((c) => {
      params.append('category', c);
    });

    authors.forEach((a) => {
      params.append('author', a);
    });

    if (keyword.trim()) {
      params.set('search', keyword);
    }

    params.set('page', page);

    setSearchParams(params);
  };

  // 分類
  const handleCategoryChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    updateFilters({
      categories: updated,
      keyword: search,
      page: 1,
    });
  };

  // 作者
  const handleAuthorChange = (author) => {
    const updated = selectedAuthors.includes(author)
      ? selectedAuthors.filter((a) => a !== author)
      : [...selectedAuthors, author];

    updateFilters({
      authors: updated,
      keyword: search,
      page: 1,
    });
  };

  // 分頁
  const handlePageChange = (page) => {
    changePage(page);

    const y =
      toolbarRef.current.getBoundingClientRect().top + window.pageYOffset - 100;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  // 分類清單
  const categories = [...new Set(works.flatMap((work) => work.categories))];

  // 作者清單
  const authors = [...new Set(works.flatMap((work) => work.authors))];

  // 篩選
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
  const {
    currentPage,
    totalPages,
    pagedData: pagedWorks,
    handlePageChange: changePage,
  } = usePagination(filteredWorks, 12);
  return (
    <Layout>
      <div className="works-container">
        <section className="page-banner works-banner">
          <h1>作品集</h1>
          <p>探索剪紙藝術作品</p>
        </section>

        {/* 搜尋列 */}
        <section className="works-toolbar" ref={toolbarRef}>
          <input
            type="text"
            placeholder="搜尋作品..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters({
                  keyword: searchInput,
                  page: 1,
                });
              }
            }}
            className="search-input"
          />

          <button className="filter-btn" onClick={() => setShowFilter(true)}>
            <FiFilter />
            <span>篩選</span>
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
                    setSearchParams({
                      page: '1',
                    });
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
          {pagedWorks.map((work) => (
            <Link
              key={work.id}
              to={`/works/${work.id}`}
              className="work-card"
              state={{
                from: location.pathname + location.search,
                scrollY: window.scrollY,
              }}
            >
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}

export default Works;
