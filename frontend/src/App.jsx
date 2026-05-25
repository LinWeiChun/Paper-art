import React, { useState, useEffect } from 'react';
import './styles/home.css';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // 🔥 輪播圖片
  const images = [
    '/images/slide1.jpg',
    '/images/slide2.jpg',
    '/images/slide3.jpg',
  ];

  // 🔥 精選作品（之後可改 API）
  const works = [
    {
      id: 1,
      title: '龍鳳呈祥',
      image: '/images/work1.jpg',
      desc: '傳統剪紙藝術',
    },
    {
      id: 2,
      title: '花開富貴',
      image: '/images/work2.jpg',
      desc: '吉祥寓意作品',
    },
    {
      id: 3,
      title: '雙喜臨門',
      image: '/images/work3.jpg',
      desc: '婚慶剪紙',
    },
  ];

  // 自動輪播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      {/* 🔥 遮罩（放這裡） */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
      {/* Header */}
      <header className="home-header">
        <h1 className="site-title">李煥章剪紙藝術</h1>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-bar ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <a href="#home">首頁</a>
            </li>
            <li>
              <a href="#author">作者介紹</a>
            </li>
            <li>
              <a href="#works">作品集</a>
            </li>
            <li>
              <a href="#contact">聯絡我們</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* 🔥 Hero 輪播 */}
<section className="hero-section" id="home">
  {images.map((img, index) => (
    <img
      key={index}
      src={img}
      className={`slider-image ${index === current ? 'active' : ''}`}
    />
  ))}

  <div className="hero-text">
    <h2 className="hero-title">李煥章剪紙藝術</h2>
    <p className="hero-subtitle">一紙一世界</p>
    <button className="explore-btn">探索作品</button>
  </div>
</section>

      {/* 🔥 精選作品 */}
      <section className="works-section" id="works">
        <h2 className="section-title">精選作品</h2>
        <p className="section-subtitle">傳統與藝術的結合</p>

        <div className="works-grid">
          {works.map((work) => (
            <div className="work-card" key={work.id}>
              <img src={work.image} alt={work.title} />
              <div className="work-content">
                <h3>{work.title}</h3>
                <p>{work.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="more-btn">查看更多作品</button>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>聯絡資訊：example@email.com</p>
        <p>電話：0912-345-678</p>
        <p>© 2026 李煥章剪紙藝術</p>
      </footer>
    </div>
  );
}

export default Home;
