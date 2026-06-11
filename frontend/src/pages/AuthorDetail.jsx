import { useNavigate, useParams } from 'react-router-dom';

import Layout from '../layouts/Layout';
import '../styles/pages/authorDetail.css';

function AuthorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const authors = {
    1: {
      name: '李煥章',
      image: '/images/author1.jpg',
      intro: '長年投入傳統剪紙藝術創作，致力於推廣民俗文化。',
      philosophy: '希望透過剪紙藝術讓更多人感受傳統工藝之美。',
      experiences: [
        '2018 地方文化館特展',
        '2020 傳統工藝推廣講師',
        '2023 剪紙藝術聯展',
      ],
    },

    2: {
      name: '王小明',
      image: '/images/author2.jpg',
      intro: '專注於現代紙雕與裝置藝術創作。',
      philosophy: '結合傳統與現代設計語彙。',
      experiences: ['2021 個人展覽', '2022 國際藝術交流展'],
    },
  };

  const author = authors[id];

  if (!author) {
    return <h1>找不到作者</h1>;
  }

  return (
    <Layout>
      <div className="author-detail-container">
        <section className="author-profile">
          <div className="author-image">
            <img src={author.image} alt={author.name} />
          </div>

          <div className="author-info">
            <h1>{author.name}</h1>

            <p>{author.intro}</p>

            <Link
              to={`/works?author=${author.name}`}
              className="author-work-btn"
            >
              查看作品
            </Link>
          </div>
        </section>

        <section className="author-philosophy">
          <h2>創作理念</h2>

          <p>{author.philosophy}</p>
        </section>

        <section className="author-experience">
          <h2>重要經歷</h2>

          <ul>
            {author.experiences.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 返回作者列表
        </button>
      </div>
    </Layout>
  );
}

export default AuthorDetail;
