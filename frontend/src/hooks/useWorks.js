import { useEffect, useState } from 'react';
import { searchArts } from '../api/artApi';

function useWorks(searchCondition = {}, page = 0, size = 12) {
  const [works, setWorks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, [page, size, JSON.stringify(searchCondition)]);

  const fetchWorks = async () => {
    setLoading(true);

    try {
      const { data } = await searchArts(searchCondition, page, size);

      setWorks(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
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
