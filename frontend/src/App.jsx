import React, { useState } from "react";
import "./styles/home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-container">
      {/* 頂部導覽列 */}
      <header className="home-header">
        <div className="logo-title">
          <h1 className="site-title">李煥章剪紙藝術</h1>
        </div>

        {/* 漢堡選單按鈕 (手機版顯示) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`nav-bar ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><a href="#home">首頁</a></li>
            <li><a href="#about">關於我們</a></li>
            <li><a href="#works">作品集</a></li>
            <li><a href="#contact">聯絡我們</a></li>
          </ul>
        </nav>
      </header>

      {/* 主視覺區塊 */}
      <section className="hero-section" id="home">
        <div className="hero-left">
          <img
            src="/images/logo.jpg"
            alt="李煥章剪紙藝術家"
            className="artist-photo"
          />
        </div>
        <div className="hero-right">
          <h2 className="hero-title">李煥章剪紙藝術</h2>
          <p className="hero-subtitle">一紙一世界</p>
          <button className="explore-btn">探索作品</button>
        </div>
      </section>

      {/* 頁尾 */}
      <footer className="home-footer">
        <p>聯絡資訊：example@email.com</p>
        <p>電話：0912-345-678</p>
        <p>© 2026 李煥章剪紙藝術</p>
      </footer>
    </div>
  );
}

export default Home;
