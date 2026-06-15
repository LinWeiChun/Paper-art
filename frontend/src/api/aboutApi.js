import api from './api';

export const getAbout = () => {
  return api.get('/about');
};

export const updateAbout = (data) => {
  return api.put('/about', data);
};
