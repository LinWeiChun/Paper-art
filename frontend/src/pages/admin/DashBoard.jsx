import '../../styles/admin/dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">後台管理系統</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>作品數量</h3>
          <p>24</p>
        </div>

        <div className="dashboard-card">
          <h3>作者數量</h3>
          <p>8</p>
        </div>

        <div className="dashboard-card">
          <h3>消息數量</h3>
          <p>12</p>
        </div>

        <div className="dashboard-card">
          <h3>會員數量</h3>
          <p>3</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>最近新增作品</h2>

        <ul>
          <li>蛇年迎春</li>
          <li>牡丹剪紙</li>
          <li>福氣滿堂</li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>最近消息</h2>

        <ul>
          <li>2026 春季剪紙展</li>
          <li>文化傳承講座</li>
          <li>剪紙藝術體驗課</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
