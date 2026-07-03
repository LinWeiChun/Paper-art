import api from './api';

export const getAllNews = (page = 0, size = 6) => {
  return api.get(`/news?page=${page}&size=${size}`);
};

export const getAdminNews = (page = 0, size = 6) => {
  return api.get(`/news/admin?page=${page}&size=${size}`);
};

export const getNewsById = (id) => {
  return api.get(`/news/${id}`);
};

export const getAdminNewsById = (id) => {
  return api.get(`/news/admin/${id}`);
};

export const createNews = (formData) => {
  return api.post('/news', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateNews = (id, formData) => {
  return api.put(`/news/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteNews = (id) => {
  return api.delete(`/news/${id}`);
};
