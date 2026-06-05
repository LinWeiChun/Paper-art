import '../styles/pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        上一頁
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
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        下一頁
      </button>
    </div>
  );
}

export default Pagination;
