// src/components/editor/plugins/ImageLibraryPlugin.js

import { ButtonView, Plugin } from 'ckeditor5';

export default class ImageLibraryPlugin extends Plugin {
  static get pluginName() {
    return 'ImageLibraryPlugin';
  }

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('imageLibrary', (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: '圖片庫',
        tooltip: '從圖片庫選擇圖片',
        withText: true,
      });

      button.on('execute', () => {
        window.dispatchEvent(
          new CustomEvent('ckeditor-open-image-library', {
            detail: {
              editor,
            },
          }),
        );
      });

      return button;
    });
  }
}
