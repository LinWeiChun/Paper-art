function Navbar({ menuOpen }) {
  return (
    <nav className={`nav-bar ${menuOpen ? 'open' : ''}`}>
      <ul>
        <li>
          <a href="/">首頁</a>
        </li>

        <li>
          <a href="/about">關於我們</a>
        </li>

        <li>
          <a href="/news">最新消息</a>
        </li>
        <li>
          <a href="/authors">作者介紹</a>
        </li>

        <li>
          <a href="/works">作品集</a>
        </li>

        <li>
          <a href="/contact">聯絡我們</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
