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
      title: '文化傳承',
      description: '保存傳統剪紙技藝與文化意涵。',
    }
  ];
  return (
    <>
      <Header currentPage="about" />

      <div className="about-container">
        <section className="about-banner">
          <h1>關於我們</h1>
          <p>傳承剪紙文化，延續匠人精神</p>
        </section>

        <section className="about-content">
          <div className="about-text">
            <h2>品牌理念</h2>

            <p>
              李煥章老師長年投入傳統剪紙藝術創作，
              將民俗文化、吉祥寓意與現代美學融合於作品之中。
            </p>

            <p>
              我們希望透過剪紙藝術， 讓更多人認識台灣與華人文化中的傳統工藝，
              並將這份文化價值持續傳承下去。
            </p>
          </div>

          <div className="about-image">
            <img src="/images/about.jpg" alt="李煥章老師創作" />
          </div>
        </section>

        <section className="about-values">
          <h2>我們的堅持</h2>

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

      <Footer />
    </>
  );
}

export default About;
