import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

function TextEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ''}
      onChange={(event, editor) => {
        const data = editor.getData();

        if (data !== value) {
          onChange(data);
        }
      }}
    />
  );
}

export default TextEditor;
