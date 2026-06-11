import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function TextEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}

export default TextEditor;
