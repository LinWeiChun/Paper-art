// src/components/editor/plugins/R2Upload.js

import api from '../../../api/api';

class R2Upload {
  constructor(loader, folder = 'ckeditor') {
    this.loader = loader;
    this.folder = folder;
    this.controller = new AbortController();
  }

  async upload() {
    try {
      const file = await this.loader.file;

      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post(`/upload/${this.folder}`, formData, {
        signal: this.controller.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        default: data.url,
      };
    } catch (error) {
      console.error('圖片上傳失敗：', error);
      throw error;
    }
  }

  abort() {
    this.controller.abort();
  }
}

export default R2Upload;
