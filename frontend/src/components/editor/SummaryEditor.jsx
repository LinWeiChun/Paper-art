// src/components/editor/SummaryEditor.jsx

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import { useEffect, useState } from 'react';

import translations from 'ckeditor5/translations/zh.js';

import SummaryConfig from './SummaryConfig';

function SummaryEditor({ value = '', onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    setData(value ?? '');
  }, [value]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        ...SummaryConfig,
        translations: [translations],
      }}
      onChange={(event, editor) => {
        const html = editor.getData();
        setData(html);
        onChange(html);
      }}
    />
  );
}

export default SummaryEditor;
