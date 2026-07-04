import api from './api';

// 前台作品搜尋
export const searchArts = (request) => {
  return api.post(`/arts/search?page=${request.page}&size=${request.size}`, {
    keyword: request.keyword,
    categoryIds: request.categoryIds,
    authorIds: request.authorIds,
    featured: request.featured,
    rentable: request.rentable,
    sort: request.sort,
  });
};

// 後台/一般分頁
export const getArts = (page = 0, size = 12) => {
  return api.get('/arts', {
    params: {
      page,
      size,
    },
  });
};

export const getAdminArts = (page = 0, size = 12) => {
  return api.get('/arts/admin', {
    params: {
      page,
      size,
    },
  });
};

// 單筆作品
export const getArtById = (id) => {
  return api.get(`/arts/${id}`);
};

export const getAdminArtById = (id) => {
  return api.get(`/arts/admin/${id}`);
};

// 新增作品
export const createArt = (art, thumbnail) => {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob([JSON.stringify(art)], {
      type: 'application/json',
    }),
  );

  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }

  return api.post('/arts', formData);
};

export const importArts = (file) => {
  const formData = new FormData();

  formData.append('file', file);

  return api.post('/arts/import', formData);
};

// 修改作品
export const updateArt = (id, art, thumbnail) => {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob([JSON.stringify(art)], {
      type: 'application/json',
    }),
  );

  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }

  return api.put(`/arts/${id}`, formData);
};

// 刪除作品
export const deleteArt = (id) => {
  return api.delete(`/arts/${id}`);
};

// 精選作品
export const getFeaturedArts = () => {
  return api.get('/arts/featured');
};
