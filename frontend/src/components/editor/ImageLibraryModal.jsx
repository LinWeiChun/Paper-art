// src/components/editor/ImageLibraryModal.jsx

import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

import ImagePicker from './ImagePicker';

import '../../styles/components/editor/ImageLibraryModal.css';

function ImageLibraryModal({ open, onClose, onSelect }) {
  // Esc 關閉
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // 禁止背景滾動
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleSelect = (image) => {
    onSelect(image);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="image-library-overlay" onClick={onClose}>
      <div className="image-library-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-library-header">
          <h2>圖片庫</h2>

          <button
            type="button"
            className="image-library-close"
            onClick={onClose}
            aria-label="關閉"
          >
            <FaTimes />
          </button>
        </div>

        <div className="image-library-body">
          <ImagePicker onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}

export default ImageLibraryModal;
