import { useCallback, useEffect, useState } from 'react';

import { getAdminAuthors, getAllAuthors } from '../api/authorsApi';

function useAuthors(page = 0, size = 6) {
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);

      if (page === null) {
        const response = await getAllAuthors();

        setAuthors(response.data || []);
        setTotalPages(1);
        return;
      }

      const response = await getAdminAuthors(page, size);

      setAuthors(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('取得作者失敗：', error);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return {
    authors,
    totalPages,
    loading,
    refreshAuthors: fetchAuthors,
  };
}

export default useAuthors;
