import api from './api';

// 取得聯絡資訊
export const getContact = () => {
  return api.get('/contact');
};

// 更新聯絡資訊
export const updateContact = (data) => {
  return api.put('/contact', data);
};
