import { useParams, Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/workDetail.css';
import works from '../data/works';

function WorkDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const handleBack = () => {
    navigate(location.state?.from || '/works', {
      state: {
        scrollY: location.state?.scrollY || 0,
      },
    });
  };
  const work = works.find((item) => item.id === Number(id));

  if (!work) {
    return (
      <>
        <Header />
        <div className="not-found">
          <h2>找不到作品</h2>
          <button className="back-btn" onClick={handleBack}>
            返回作品集
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="detail-container">
        <div className="detail-image">
          <img src={work.image} alt={work.title} />
        </div>

        <div className="detail-content">
          <h1>{work.title}</h1>

          <p>
            <strong>作者：</strong>
            {work.authors.join('、')}
          </p>

          <p>
            <strong>年份：</strong>
            {work.year}
          </p>

          <div className="detail-tags">
            {work.categories.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="detail-description">
            <h3>作品介紹</h3>

            <p>{work.description}</p>
          </div>
          <button className="back-btn" onClick={handleBack}>
            返回作品集
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WorkDetail;
