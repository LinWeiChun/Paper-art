import { useEffect, useRef, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getArts } from '../api/artApi';
import Pagination from '../components/common/Pagination';
import { useRental } from '../contexts/RentalContext';
import useAuthors from '../hooks/useAuthors';
import useCategories from '../hooks/useCategories';
import Layout from '../layouts/Layout';

import '../styles/pages/works.css';

function Works() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const toolbarRef = useRef(null);

  /* ===== Hooks ===== */
  const { categories, loading } = useCategories();
  const { authors, loading: authorLoading } = useAuthors();
  const { addToRental, isInRental } = useRental();

  /* ===== URL 參數 ===== */
  const search = searchParams.get('search') || '';
  const selectedCategories = searchParams.getAll('category');
  const selectedAuthors = searchParams.getAll('author');

  /* ===== State ===== */
  const [searchInput, setSearchInput] = useState(search);
  const [showFilter, setShowFilter] = useState(false);
  const [works, setWorks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchWorks = async () => {
    try {
      const response = await getArts(currentPage - 1, 12);

      setWorks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得作品失敗：', error);
    }
  };
  /* ===== useEffect ===== */

  // 搜尋欄同步 URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // 返回列表時恢復捲動位置
  useEffect(() => {
    if (location.state?.scrollY !== undefined) {
      window.scrollTo({
        top: location.state.scrollY,
        behavior: 'auto',
      });
    }
  }, [location.state]);

  useEffect(() => {
    fetchWorks();
  }, [currentPage]);

  /* ===== 更新 URL ===== */
  const updateFilters = ({
    categories = selectedCategories,
    authors = selectedAuthors,
    keyword = search,
    page = 1,
  }) => {
    const params = new URLSearchParams();

    categories.forEach((category) => {
      params.append('category', category);
    });

    authors.forEach((author) => {
      params.append('author', author);
    });

    if (keyword.trim()) {
      params.set('search', keyword);
    }

    params.set('page', page);

    setSearchParams(params);
  };

  /* ===== 分類切換 ===== */
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

  /* ===== 作者切換 ===== */
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

  /* ===== 篩選作品 ===== */
  const filteredWorks = works.filter((work) => {
    const matchSearch = work.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        work.categories?.some((c) => c.name === category),
      );

    const matchAuthor =
      selectedAuthors.length === 0 ||
      selectedAuthors.some((author) =>
        work.authors?.some((a) => a.name === author),
      );

    return matchSearch && matchCategory && matchAuthor;
  });
  /* ===== 分頁 ===== */
  const handlePageChange = (page) => {
    updateFilters({ page });

    const y =
      toolbarRef.current.getBoundingClientRect().top + window.pageYOffset - 100;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

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

        {/* 已套用篩選 */}
        {(selectedCategories.length > 0 ||
          selectedAuthors.length > 0 ||
          search) && (
          <section className="active-filters">
            <div className="filter-tags">
              {/* 分類 */}
              {selectedCategories.map((category) => (
                <button
                  key={category}
                  className="active-tag"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                  <span className="tag-remove">×</span>
                </button>
              ))}

              {/* 作者 */}
              {selectedAuthors.map((author) => (
                <button
                  key={author}
                  className="active-tag"
                  onClick={() => handleAuthorChange(author)}
                >
                  {author}
                  <span className="tag-remove">×</span>
                </button>
              ))}

              {/* 搜尋關鍵字 */}
              {search && (
                <button
                  className="active-tag"
                  onClick={() => {
                    setSearchInput('');

                    setSearchParams({
                      page: '1',
                    });
                  }}
                >
                  搜尋：{search}
                  <span className="tag-remove">×</span>
                </button>
              )}
            </div>

            <button
              className="clear-filter-btn"
              onClick={() => {
                setSearchInput('');

                setSearchParams({
                  page: '1',
                });
              }}
            >
              清除篩選
            </button>
          </section>
        )}

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

                {!loading &&
                  categories.map((category) => (
                    <label key={category.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                      />

                      <span>{category.name}</span>
                    </label>
                  ))}
              </div>

              {/* 作者 */}
              <div className="filter-group">
                <h3>作者</h3>

                {!authorLoading &&
                  authors.map((author) => (
                    <label key={author.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(author.name)}
                        onChange={() => handleAuthorChange(author.name)}
                      />

                      <span>{author.name}</span>
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
          {filteredWorks.map((work) => (
            <div className="work-card-wrapper" key={work.id}>
              {/* <button
                className={`add-rental-btn ${
                  isInRental(work.id) ? 'added' : ''
                }`}
                disabled={isInRental(work.id)}
                onClick={(e) => {
                  e.preventDefault();
                  addToRental(work);
                }}
              >
                {isInRental(work.id) ? '已加入' : '＋ 租借'}
              </button> */}
              <Link
                to={`/works/${work.id}`}
                className="work-card"
                state={{
                  from: location.pathname + location.search,
                  scrollY: window.scrollY,
                }}
              >
                <img src={work.thumbnail} alt={work.title} />

                <div className="work-content">
                  <h3>{work.title}</h3>
                  <p>{work.authors?.map((author) => author.name).join('、')}</p>
                  <div className="work-tags">
                    {work.categories?.map((category) => (
                      <span key={category.id}>{category.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
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
