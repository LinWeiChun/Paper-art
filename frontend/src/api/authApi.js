import api from './api';
import { clearCsrfToken } from './api';

export const login = (data) => {
  return api.post('/auth/login', data);
};

export const logout = async () => {
  try {
    return await api.post('/auth/logout');
  } finally {
    clearCsrfToken();
  }
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};
