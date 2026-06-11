import { useEffect, useState } from 'react';

import works from '../data/works';
import '../styles/pages/home.css';

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

  // 自動輪播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Layout>
      <div className="home-container">
        {menuOpen && (
          <div className="overlay" onClick={() => setMenuOpen(false)} />
        )}

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
              <Link
                to={`/works/${work.id}`}
                className="work-card"
                key={work.id}
              >
                <img src={work.image} alt={work.title} />

                <div className="work-content">
                  <h3>{work.title}</h3>
                  <p>{work.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/works" className="more-btn">
            查看更多作品
          </Link>
        </section>
      </div>
    </Layout>
  );
}

export default Home;
