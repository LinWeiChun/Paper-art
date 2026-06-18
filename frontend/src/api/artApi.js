import api from './api';

// 分頁作品（前後台共用）
export const getArts = (page = 0, size = 12) => {
  return api.get('/arts', {
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
