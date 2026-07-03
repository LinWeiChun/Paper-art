import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getArtById } from '../api/artApi';
import Layout from '../layouts/Layout';
import { sanitizeHtml } from '../utils/sanitizeHtml';

import '../styles/pages/workDetail.css';

function WorkDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const dimensions = [work?.lengthCm, work?.widthCm, work?.heightCm]
    .filter((value) => value !== null && value !== undefined && value !== '')
    .join(' × ');

  // 返回作品列表
  const handleBack = () => {
    navigate(location.state?.from || '/works', {
      state: {
        scrollY: location.state?.scrollY || 0,
      },
    });
  };

  // 取得作品資料
  useEffect(() => {
    fetchWork();
  }, [id]);

  const fetchWork = async () => {
    try {
      setLoading(true);

      const response = await getArtById(id);

      setWork(response.data);
    } catch (error) {
      console.error('取得作品失敗：', error);
      setWork(null);
    } finally {
      setLoading(false);
    }
  };

  // 載入中
  if (loading) {
    return (
      <Layout>
        <div className="detail-container">
          <p>載入中...</p>
        </div>
      </Layout>
    );
  }

  // 找不到資料
  if (!work) {
    return (
      <Layout>
        <div className="not-found">
          <h2>找不到作品</h2>

          <button className="back-btn" onClick={handleBack}>
            前往作品集
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-container">
        {/* 左側圖片 */}
        <div className="detail-image">
          <img src={work.thumbnail} alt={work.title} />
        </div>

        {/* 右側內容 */}
        <div className="detail-content">
          <h1>{work.title}</h1>

          <p>
            <strong>作者：</strong>
            {work.authors?.map((author) => author.name).join('、')}
          </p>

          <div className="detail-meta">
            {work.artNumber && (
              <div>
                <span>作品編號</span>
                <strong>{work.artNumber}</strong>
              </div>
            )}

            {dimensions && (
              <div>
                <span>尺寸(cm)</span>
                <strong>{dimensions}</strong>
              </div>
            )}

            {work.material && (
              <div>
                <span>材質</span>
                <strong>{work.material}</strong>
              </div>
            )}

            {work.color && (
              <div>
                <span>色彩</span>
                <strong>{work.color}</strong>
              </div>
            )}

            {work.technique && (
              <div>
                <span>剪刻技法</span>
                <strong>{work.technique}</strong>
              </div>
            )}

            {work.creationPeriod && (
              <div>
                <span>製作年代</span>
                <strong>{work.creationPeriod}</strong>
              </div>
            )}

            {work.artworkType && (
              <div>
                <span>作品型態</span>
                <strong>{work.artworkType}</strong>
              </div>
            )}
          </div>

          {/* <p>
            <strong>年份：</strong>
            {work.year || '未提供'}
          </p> */}

          {/* 分類 */}
          <div className="detail-tags">
            {work.categories?.map((category) => (
              <span key={category.id}>{category.name}</span>
            ))}
          </div>

          {/* 作品介紹 */}
          <div className="detail-description">
            <h3>作品介紹</h3>

            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(work.description),
              }}
            />
          </div>

          {work.remarks && (
            <div className="detail-description">
              <h3>備註</h3>

              <p>{work.remarks}</p>
            </div>
          )}

          {/* 按鈕 */}
          <div className="detail-actions">
            {/* {isInRental(work.id) ? (
              <button className="rental-btn added" disabled>
                ✓ 已加入租借清單
              </button>
            ) : (
              <button className="rental-btn" onClick={() => addToRental(work)}>
                ＋ 加入租借清單
              </button>
            )} */}

            <button className="back-btn" onClick={handleBack}>
              返回作品集
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WorkDetail;
