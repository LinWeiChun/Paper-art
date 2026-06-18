import api from './api';

// 前台：全部分類
export const getAllCategories = () => {
  return api.get('/categories');
};

// 後台：分頁分類
export const getAdminCategories = (page = 0, size = 10) => {
  return api.get('/categories/admin', {
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
