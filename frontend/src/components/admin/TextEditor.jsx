import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { memo } from 'react';

function TextEditor({ value, onChange }) {
  return (
    <CKEditor
      key={value ? 'loaded' : 'empty'}
      editor={ClassicEditor}
      data={value ?? ''}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}

export default memo(TextEditor);
