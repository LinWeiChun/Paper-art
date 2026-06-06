import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import '../styles/pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 只有一頁時不顯示分頁
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="page-nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FiChevronLeft />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={currentPage === page ? 'page-btn active' : 'page-btn'}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
