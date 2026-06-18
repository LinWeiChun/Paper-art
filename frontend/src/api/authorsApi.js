import api from './api';

// 前台：全部作者
export const getAllAuthors = () => {
  return api.get('/authors');
};

// 後台：分頁作者
export const getAdminAuthors = (page = 0, size = 10) => {
  return api.get('/authors/page', {
    params: {
      page,
      size,
    },
  });
};

// 單筆作者
export const getAuthorById = (id) => {
  return api.get(`/authors/${id}`);
};

// 新增作者
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

// 修改作者
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

// 刪除作者
export const deleteAuthor = (id) => {
  return api.delete(`/authors/${id}`);
};
