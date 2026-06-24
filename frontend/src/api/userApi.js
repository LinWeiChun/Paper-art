// src/api/userApi.js
import api from './api';

// 取得全部管理者
export const getUsers = () => {
  return api.get('/users');
};

// 取得單一管理者
export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

// 新增管理者
export const createUser = (data) => {
  return api.post('/users', data);
};

// 修改管理者
export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

// 啟用管理者
export const enableUser = (id) => {
  return api.patch(`/users/${id}/enable`);
};

// 停用管理者
export const disableUser = (id) => {
  return api.patch(`/users/${id}/disable`);
};

// 刪除管理者
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
