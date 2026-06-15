import api from './api';

// 查全部
export const getAllAuthors = (page = 0, size = 10) => {
  return api.get(`/authors?page=${page}&size=${size}`);
};

// 查單筆
export const getAuthorById = (id) => {
  return api.get(`/authors/${id}`);
};

// 新增
export const createAuthor = (author, avatar) => {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob([JSON.stringify(author)], {
      type: 'application/json',
    }),
  );

  if (avatar) {
    formData.append('avatar', avatar);
  }

  return api.post('/authors', formData);
};

// 修改
export const updateAuthor = (id, author, avatar) => {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob([JSON.stringify(author)], {
      type: 'application/json',
    }),
  );

  if (avatar) {
    formData.append('avatar', avatar);
  }

  return api.put(`/authors/${id}`, formData);
};

// 刪除
export const deleteAuthor = (id) => {
  return api.delete(`/authors/${id}`);
};
