// api/api.js
import axios from 'axios';

import { clearAuthSession } from '../utils/authSession';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SAFE_METHODS = new Set(['get', 'head', 'options']);

const api = axios.create({
  baseURL: `${API_BASE_URL}/paper/api`,
  withCredentials: true,
});

let csrfToken = null;
let csrfRequest = null;

const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfRequest) {
    csrfRequest = api
      .get('/auth/csrf', { skipCsrf: true })
      .then((response) => {
        csrfToken = response.data.token;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() || 'get';

  if (!SAFE_METHODS.has(method) && !config.skipCsrf) {
    config.headers.set('X-XSRF-TOKEN', await getCsrfToken());
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      window.dispatchEvent(new Event('paperart:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export default api;
