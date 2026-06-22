import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getFeaturedArts } from '../api/artApi';
import { getBanners } from '../api/bannerApi';

import Layout from '../layouts/Layout';

import '../styles/pages/home.css';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Banner
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // 精選作品
  const [featuredWorks, setFeaturedWorks] = useState([]);

  // Banner API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();

      setSlides(response.data || []);
    } catch (error) {
      console.error('取得 Banner 失敗：', error);
    }
  };

  // 自動輪播
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides]);

  // 精選作品
  useEffect(() => {
    fetchFeaturedWorks();
  }, []);

  const fetchFeaturedWorks = async () => {
    try {
      const response = await getFeaturedArts();

      setFeaturedWorks(response.data || []);
    } catch (error) {
      console.error('取得精選作品失敗：', error);
    }
  };

  return (
    <Layout>
      <div className="home-container">
        {menuOpen && (
          <div className="overlay" onClick={() => setMenuOpen(false)} />
        )}

        {/* Hero Banner */}
        {slides.length > 0 && (
          <section className="hero-section" id="home">
            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                className={`slider-image ${index === current ? 'active' : ''}`}
              />
            ))}

            <div className="hero-text">
              <h2 className="hero-title">{slides[current]?.title}</h2>

              <p className="hero-subtitle">{slides[current]?.subtitle}</p>
            </div>
          </section>
        )}

        {/* 精選作品 */}
        <section className="works-section" id="works">
          <h2 className="section-title">精選作品</h2>

          <p className="section-subtitle">傳統與藝術的結合</p>

          <div className="works-grid">
            {featuredWorks.map((work) => (
              <Link
                key={work.id}
                to={`/works/${work.id}`}
                className="work-card"
              >
                <img src={work.thumbnail} alt={work.title} />

                <div className="work-content">
                  <h3>{work.title}</h3>

                  <p>{work.authors?.map((author) => author.name).join('、')}</p>
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
