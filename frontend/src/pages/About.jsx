import { useEffect, useState } from 'react';
import { getAbout } from '../api/aboutApi';
import Layout from '../layouts/Layout';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import '../styles/pages/about.css';

function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await getAbout();

      setAbout(response.data);
    } catch (error) {
      console.error('取得 About 失敗：', error);
    }
  };

  if (!about) {
    return (
      <Layout>
        <div className="about-container">
          <h2>載入中...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="about-container">
        {/* Banner */}
        {/* <section className="page-banner about-banner">
          <h1>{about.bannerTitle}</h1>
          <p>{about.bannerSubtitle}</p>
        </section> */}

        {/* 品牌故事 */}
        <section className="about-story">
          <div className="about-image">
            <img src="/images/logo.jpg" alt="logo" />
          </div>

          <div className="about-text">
            <span className="section-tag">BRAND STORY</span>

            <h2>{about.storyTitle}</h2>

            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(about.storyContent),
              }}
            />
          </div>
        </section>

        {/* 願景 */}
        {about.vision && (
          <section className="about-vision">
            <h2>願景</h2>
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(about.vision),
              }}
            />
          </section>
        )}

        {/* 核心價值 */}
        {about.values?.length > 0 && (
          <section className="about-values">
            <h2>核心價值</h2>

            <div className="value-cards">
              {about.values.map((item) => (
                <div className="value-card" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

export default About;
