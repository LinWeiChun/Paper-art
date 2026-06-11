import Layout from '../layouts/Layout';
import '../styles/pages/about.css';

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
    <Layout>
      <div className="about-container">
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
      </div>
    </Layout>
  );
}

export default About;
