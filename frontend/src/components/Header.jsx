import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      <header className={`home-header ${scrolled ? 'shrink' : ''}`}>
        <Link to="/" className="site-title-link">
          <h1 className="site-title">李煥章剪紙藝術</h1>
        </Link>
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-bar ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="/">首頁</Link>
            </li>
            <li>
              <Link to="/about">關於我們</Link>
            </li>
            <li>
              <Link to="/news">最新消息</Link>
            </li>
            <li>
              <Link to="/authors">作者介紹</Link>
            </li>
            <li>
              <Link to="/works">作品集</Link>
            </li>
            <li>
              <Link to="/contact">聯絡我們</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
