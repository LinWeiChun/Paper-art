import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRental } from '../contexts/RentalContext';
import Layout from '../layouts/Layout';

import '../styles/pages/rentalRequest.css';

function RentalRequest() {
  const navigate = useNavigate();

  const { rentalList, clearRental } = useRental();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    startDate: '',
    endDate: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...formData,

      // 只送作品 id 即可
      artIds: rentalList.map((work) => work.id),
    });

    alert('租借申請已送出');

    clearRental();
    navigate('/rental');
  };

  return (
    <Layout>
      <div className="rental-request-container">
        {/* Banner */}
        <section className="page-banner rental-request-banner">
          <h1>租借申請</h1>
          <p>請填寫聯絡資訊，我們將盡快與您聯繫</p>
        </section>

        <div className="rental-request-content">
          {/* 左側表單 */}
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>電話</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>單位名稱</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>租借開始日期</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>租借結束日期</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>備註</label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              送出租借申請
            </button>
          </form>

          {/* 右側作品摘要 */}
          <div className="selected-works">
            <h2>已選作品</h2>

            {rentalList.map((work) => (
              <div className="selected-work-item" key={work.id}>
                <img src={work.thumbnail} alt={work.title} />

                <div>
                  <h3>{work.title}</h3>

                  <p>{work.authors?.map((author) => author.name).join('、')}</p>

                  <p>{work.year || '未提供'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RentalRequest;
