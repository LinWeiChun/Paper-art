import { useEffect, useState } from 'react';
import { getAdminAuthors } from '../api/authorsApi';

function useAuthors(page = 0, size = 6) {
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, [page, size]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);

      const response = await getAdminAuthors(page, size);

      setAuthors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('取得作者失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    authors,
    totalPages,
    loading,
    refreshAuthors: fetchAuthors,
  };
}

export default useAuthors;
