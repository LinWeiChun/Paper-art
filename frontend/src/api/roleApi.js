import api from './api';

export const getAllRoles = () => {
  return api.get('/roles');
};
