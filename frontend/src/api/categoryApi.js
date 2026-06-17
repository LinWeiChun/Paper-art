import api from './api';

// 分頁查詢分類
export const getAllCategories = (page = 0, size = 10) => {
  return api.get('/categories', {
    params: {
      page,
      size,
    },
  });
};

// 單筆分類
export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

// 新增分類
export const createCategory = (data) => {
  return api.post('/categories', data);
};

// 修改分類
export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

// 刪除分類
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
