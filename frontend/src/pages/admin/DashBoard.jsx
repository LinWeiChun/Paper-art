import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { getDashboard } from '../../api/dashboardApi';

import '../../styles/admin/dashboard.css';

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    artCount: 0,
    authorCount: 0,
    newsCount: 0,
    recentArts: [],
    recentNews: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboard();

      console.log(response.data); // ← 建議保留

      setDashboard(response.data);
    } catch (error) {
      console.error('取得 Dashboard 資料失敗：', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page dashboard">
      <h1 className="admin-title">後台管理系統</h1>

      {/* 統計卡片 */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>作品數量</h3>
          <p>{dashboard.artCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>作者數量</h3>
          <p>{dashboard.authorCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>消息數量</h3>
          <p>{dashboard.newsCount}</p>
        </div>
      </div>

      {/* 最近新增作品 */}
      <div className="dashboard-section">
        <h2>最近新增作品</h2>

        {loading ? (
          <ul>
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="skeleton-item"></li>
            ))}
          </ul>
        ) : dashboard.recentArts.length === 0 ? (
          <p>目前沒有資料</p>
        ) : (
          <ul>
            {dashboard.recentArts.map((art) => (
              <li key={art.id}>{art.title || art.name || '未命名作品'}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 最近消息 */}
      <div className="dashboard-section">
        <h2>最近消息</h2>

        {loading ? (
          <ul>
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="skeleton-item"></li>
            ))}
          </ul>
        ) : dashboard.recentNews.length === 0 ? (
          <p>目前沒有資料</p>
        ) : (
          <ul>
            {dashboard.recentNews.map((news) => (
              <li key={news.id}>{news.title || news.name || '未命名消息'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
