// api/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/paper/api',
  baseURL: 'https://paper-art-production.up.railway.app/paper/api',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
