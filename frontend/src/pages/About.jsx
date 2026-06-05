import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/about.css';

function About() {
  const values = [
    {
      id: 1,
      title: '文化傳承',
      description: '保存傳統剪紙技藝與文化意涵。',
    },
    {
      id: 2,
      title: '藝術推廣',
      description: '讓更多人接觸並喜愛剪紙藝術。',
    },
    {
      id: 3,
      title: '創新發展',
      description: '結合現代設計，展現剪紙藝術新生命。',
    },
  ];

  return (
    <>
      <Header />

      <main className="about-container">
        {/* Banner */}
        <section className="page-banner about-banner">
          <h1>關於我們</h1>
          <p>傳承剪紙文化，延續匠人精神</p>
        </section>

        {/* 品牌故事 */}
        <section className="about-story">
          <div className="about-image">
            <img src="/images/logo.jpg" alt="李煥章老師創作" />
          </div>

          <div className="about-text">
            <span className="section-tag">BRAND STORY</span>

            <h2>李煥章剪紙藝術</h2>

            <p>
              李煥章老師長年投入傳統剪紙藝術創作，
              將民俗文化、吉祥寓意與現代美學融合於作品之中。
            </p>

            <p>
              剪紙不只是技藝，更是一種文化記憶。
              我們希望透過作品展示、教育推廣與文化交流，
              讓更多人認識這門珍貴的傳統藝術。
            </p>
          </div>
        </section>

        {/* 品牌理念 */}
        <section className="about-mission">
          <h2>我們的理念</h2>

          <div className="mission-content">
            <div>
              <h3>保存文化價值</h3>
              <p>將傳統剪紙技藝與文化故事完整保存， 持續向下一代傳承。</p>
            </div>

            <div>
              <h3>推廣藝術教育</h3>
              <p>透過展覽、課程與交流活動， 提升大眾對剪紙藝術的認識。</p>
            </div>

            <div>
              <h3>連結現代生活</h3>
              <p>將傳統元素融入當代設計， 讓文化走進更多人的生活。</p>
            </div>
          </div>
        </section>

        {/* 核心價值 */}
        <section className="about-values">
          <h2>核心價值</h2>

          <div className="value-cards">
            {values.map((item) => (
              <div className="value-card" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
