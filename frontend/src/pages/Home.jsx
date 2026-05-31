import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // 🔥 輪播圖片
  const slides = [
    {
      image: '/images/slide1.jpg',
      title: '李煥章剪紙藝術',
      subtitle: '一紙一世界',
    },
    {
      image: '/images/slide2.jpg',
      title: '最新展覽',
      subtitle: '2026 春季作品展',
    },
    {
      image: '/images/slide3.jpg',
      title: '作品上架',
      subtitle: '花開富貴系列',
    },
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
      setCurrent((prev) => (prev + 1) % slides.length);
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
      <Header currentPage="home" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 🔥 Hero 輪播 */}
      <section className="hero-section" id="home">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.title}
            className={`slider-image ${index === current ? 'active' : ''}`}
          />
        ))}

        <div className="hero-text">
          <h2 className="hero-title">{slides[current].title}</h2>

          <p className="hero-subtitle">{slides[current].subtitle}</p>
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
      <Footer />
    </div>
  );
}

export default Home;
