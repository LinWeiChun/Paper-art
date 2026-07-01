// src/components/editor/plugins/UploadAdapter.js

import R2Upload from './R2Upload';

const EDITOR_IMAGE_FOLDER = 'editor-images';

export default function UploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new R2Upload(loader, EDITOR_IMAGE_FOLDER);
  };
}
