import axios from 'axios';

const API_URL = import.meta.env.API_URL + '/api/news';

export const getAllNews = (page = 0, size = 6) => {
  return axios.get(`${API_URL}?page=${page}&size=${size}`);
};

export const getNewsById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createNews = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateNews = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteNews = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
