import api from './api';

// 前台 Banner
export const getBanners = () => {
  return api.get('/banners');
};

// 後台 Banner
export const getAllBanners = () => {
  return api.get('/banners/admin');
};

// 單筆
export const getBannerById = (id) => {
  return api.get(`/banners/${id}`);
};

export const getAdminBannerById = (id) => {
  return api.get(`/banners/admin/${id}`);
};

// 新增 Banner
export const createBanner = (data, image) => {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          subtitle: data.subtitle,
          sortOrder: Number(data.sortOrder),
          active: data.active,
        }),
      ],
      {
        type: 'application/json',
      },
    ),
  );

  if (image) {
    formData.append('image', image);
  }

  return api.post('/banners', formData);
};

// 更新 Banner
export const updateBanner = (id, data, image) => {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          subtitle: data.subtitle,
          sortOrder: Number(data.sortOrder),
          active: data.active,
        }),
      ],
      {
        type: 'application/json',
      },
    ),
  );

  if (image) {
    formData.append('image', image);
  }

  return api.put(`/banners/${id}`, formData);
};

// 刪除
export const deleteBanner = (id) => {
  return api.delete(`/banners/${id}`);
};
