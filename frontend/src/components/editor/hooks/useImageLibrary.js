import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/api';

export default function useImageLibrary(
  folder = 'ckeditor',
  page = 0,
  size = 20,
  keyword = '',
) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`/upload/${folder}`, {
        params: {
          page,
          size,
          keyword,
        },
      });

      setImages(data.content);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setHasNext(data.hasNext);
    } finally {
      setLoading(false);
    }
  }, [folder, page, size, keyword]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const deleteImage = async (key) => {
    await api.delete('/upload', {
      params: { key },
    });

    fetchImages();
  };

  return {
    images,
    loading,

    currentPage,
    totalPages,
    hasNext,

    refresh: fetchImages,
    deleteImage,
  };
}
