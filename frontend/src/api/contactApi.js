import api from './api';

// 取得聯絡資訊
export const getContact = () => {
  return api.get('/contact');
};

// 更新聯絡資訊
export const updateContact = (data) => {
  return api.put('/contact', data);
};

// 送出聯絡表單
export const submitContactMessage = (data) => {
  return api.post('/contact-messages', data);
};

// 取得聯絡表單訊息
export const getContactMessages = (page = 0, size = 10) => {
  return api.get('/contact-messages', {
    params: {
      page,
      size,
    },
  });
};

// 取得單一聯絡表單訊息
export const getContactMessageById = (id) => {
  return api.get(`/contact-messages/${id}`);
};

// 更新聯絡表單處理狀態
export const updateContactMessageProcessed = (id, processed) => {
  return api.put(`/contact-messages/${id}/processed`, {
    processed,
  });
};
