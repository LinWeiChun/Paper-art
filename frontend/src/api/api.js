// api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/paper/api',
  // baseURL: 'https://paper-art-production.up.railway.app/paper/api',
});

export default api;
