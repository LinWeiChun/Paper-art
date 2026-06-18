import { useCallback, useEffect, useState } from 'react';
import { getAllCategories } from '../api/categoryApi';

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error('取得分類失敗：', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
  };
}

export default useCategories;
