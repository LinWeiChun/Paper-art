import { useEffect, useState } from 'react';

import { getDashboard } from '../../api/dashboardApi';

import '../../styles/admin/dashboard.css';

function Dashboard() {
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

      setDashboard(response.data);
    } catch (error) {
      console.error('取得 Dashboard 資料失敗：', error);
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

        {dashboard.recentArts.length === 0 ? (
          <p>目前沒有資料</p>
        ) : (
          <ul>
            {dashboard.recentArts.map((art) => (
              <li key={art.id}>{art.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 最近消息 */}
      <div className="dashboard-section">
        <h2>最近消息</h2>

        {dashboard.recentNews.length === 0 ? (
          <p>目前沒有資料</p>
        ) : (
          <ul>
            {dashboard.recentNews.map((news) => (
              <li key={news.id}>{news.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
