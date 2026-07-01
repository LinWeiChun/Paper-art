// src/components/editor/Editor.jsx

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import { useEffect, useState } from 'react';

import translations from 'ckeditor5/translations/zh.js';

import EditorConfig from './EditorConfig';
import ImageLibraryModal from './ImageLibraryModal';

function Editor({ value = '', onChange }) {
  const [data, setData] = useState(value);
  const [editor, setEditor] = useState(null);
  const [openLibrary, setOpenLibrary] = useState(false);

  useEffect(() => {
    setData(value ?? '');
  }, [value]);

  // 監聽 CKEditor 工具列「圖片庫」按鈕
  useEffect(() => {
    const handler = (event) => {
      setEditor(event.detail.editor);
      setOpenLibrary(true);
    };

    window.addEventListener('ckeditor-open-image-library', handler);

    return () => {
      window.removeEventListener('ckeditor-open-image-library', handler);
    };
  }, []);

  // 插入圖片
  const handleSelectImage = (image) => {
    if (!editor) return;

    editor.model.change((writer) => {
      const imageElement = writer.createElement('imageBlock', {
        src: image.url,
      });

      editor.model.insertContent(imageElement, editor.model.document.selection);
    });

    setOpenLibrary(false);
  };

  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        config={{
          ...EditorConfig,
          translations: [translations],
        }}
        data={data}
        onReady={(editorInstance) => {
          setEditor(editorInstance);
        }}
        onChange={(event, editorInstance) => {
          const html = editorInstance.getData();
          setData(html);

          if (onChange) {
            onChange(html);
          }
        }}
      />

      <ImageLibraryModal
        open={openLibrary}
        onClose={() => setOpenLibrary(false)}
        onSelect={handleSelectImage}
      />
    </>
  );
}

export default Editor;
