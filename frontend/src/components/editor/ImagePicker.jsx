// src/components/editor/ImagePicker.jsx

import { useState } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';

import useImageLibrary from './hooks/useImageLibrary';

import '../../styles/components/editor/ImagePicker.css';

function ImagePicker({ folder = 'ckeditor', onSelect }) {
  const PAGE_SIZE = 20;

  const [page, setPage] = useState(0);

  const [keyword, setKeyword] = useState('');

  const [searchText, setSearchText] = useState('');

  const {
    images,
    loading,
    totalPages,
    currentPage,
    hasNext,
    refresh,
    deleteImage,
  } = useImageLibrary(folder, page, PAGE_SIZE, keyword);

  const handleSearch = () => {
    setPage(0);
    setKeyword(searchText.trim());
  };

  const handleDelete = async (key) => {
    if (!window.confirm('確定刪除此圖片？')) {
      return;
    }

    await deleteImage(key);

    refresh();
  };

  return (
    <div className="image-picker">
      {/* 搜尋列 */}
      <div className="image-picker-toolbar">
        <div className="image-picker-search-box">
          <input
            className="image-picker-search-input"
            type="text"
            placeholder="搜尋圖片..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 阻止 form submit
                e.stopPropagation(); // 不讓事件往外傳
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            className="image-picker-search-btn"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="image-picker-loading">載入圖片中...</div>}

      {/* Empty */}
      {!loading && images.length === 0 && (
        <div className="image-picker-empty">找不到任何圖片</div>
      )}

      {/* Grid */}
      {!loading && images.length > 0 && (
        <div className="image-picker-grid">
          {images.map((image) => (
            <div key={image.key} className="image-picker-item">
              <img
                src={image.url}
                alt={image.name}
                onClick={() => onSelect(image)}
              />

              <div className="image-picker-footer">
                <span className="image-picker-name" title={image.name}>
                  {image.name}
                </span>

                <button
                  type="button"
                  className="image-picker-delete"
                  onClick={() => handleDelete(image.key)}
                >
                  <FaTrash />
                </button>
              </div>

              <div className="image-picker-meta">
                <span>{(image.size / 1024).toFixed(1)} KB</span>

                <span>
                  {image.lastModified
                    ? new Date(image.lastModified).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="image-picker-pagination">
          <button
            type="button"
            disabled={currentPage <= 0}
            onClick={() => setPage((p) => p - 1)}
          >
            上一頁
          </button>

          <span>
            第 {currentPage + 1} / {totalPages} 頁
          </span>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}

export default ImagePicker;
