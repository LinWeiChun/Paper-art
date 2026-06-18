import { useEffect, useState } from 'react';
import { getArts } from '../api/artApi';

function useWorks(page = 0, size = 12) {
  const [works, setWorks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, [page]);

  const fetchWorks = async () => {
    try {
      const response = await getArts(page, size);

      setWorks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('取得作品失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    works,
    totalPages,
    loading,
    refreshWorks: fetchWorks,
  };
}

export default useWorks;
