import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/product.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const works = Array.from({ length: 27 }).map((_, index) => ({
    id: index + 1,
    name: `作品 ${index + 1}`,
  }));

  const worksPerPage = 9;
  const totalPages = Math.ceil(works.length / worksPerPage);
  const startIndex = (currentPage - 1) * worksPerPage;
  const currentWorks = works.slice(startIndex, startIndex + worksPerPage);

  return (
    <div className="home-container">
      {/* 首頁區塊 */}
      <header className="home-header">
        <h1 className="site-title">我的作品集首頁</h1> {/* H1 標籤 */}
        <img src="/image/banner.JPG" alt="網站 Banner" className="banner-img" />
      </header>

      <div className="home-main">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <aside className={`home-sidebar ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><a href="#home">首頁</a></li>
            <li><a href="#activities">近期活動</a></li>
            <li><a href="#portfolio">作品展示</a></li>
            <li><a href="#bio">生平介紹</a></li>
          </ul>
        </aside>

        <main className="home-body">
          {/* 首頁區塊 */}
          <section id="home">
            <h2>歡迎來到我的作品集</h2>
            <p>這裡展示了我的最新活動、作品以及生平介紹。</p>
          </section>

          {/* 作品展示區塊 */}
          <section id="portfolio">
            <h2>作品展示</h2>

            {/* 桌機版 Grid */}
            <div className="desktop-only">
              <div className="portfolio-grid">
                {currentWorks.map((work) => (
                  <div key={work.id} className="portfolio-item">{work.name}</div>
                ))}
              </div>
            </div>

            {/* 平板 & 手機版 Swiper */}
            <div className="mobile-tablet">
              <Swiper
                spaceBetween={20}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  600: { slidesPerView: 2 },
                }}
              >
                {currentWorks.map((work) => (
                  <SwiperSlide key={work.id}>
                    <div className="portfolio-item">{work.name}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 換頁標示 */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                上一頁
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                下一頁
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="home-footer">
        <p>聯絡資訊：example@email.com</p>
        <p>電話：0912-345-678</p>
        <p>© 2026 我的作品集</p>
      </footer>
    </div>
  );
}

export default Home;
