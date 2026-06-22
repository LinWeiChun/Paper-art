import { useEffect, useState } from 'react';
import { getBanners } from '../api/bannerApi';

function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();

      setBanners(response.data || []);
    } catch (error) {
      console.error('取得 Banner 失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    banners,
    loading,
    refreshBanners: fetchBanners,
  };
}

export default useBanners;
