// src/components/editor/SummaryConfig.js

import {
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Strikethrough,
  Underline,
  Undo,
} from 'ckeditor5';

const SummaryConfig = {
  licenseKey: 'GPL',

  language: {
    ui: 'zh',
    content: 'zh',
  },

  plugins: [
    Essentials,
    Paragraph,
    Heading,

    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,

    Bold,
    Italic,
    Underline,
    Strikethrough,

    Link,
    List,

    Undo,
  ],

  toolbar: {
    shouldNotGroupWhenFull: true,

    items: [
      'undo',
      'redo',

      '|',

      'heading',

      '|',

      'fontFamily',
      'fontSize',

      '|',

      'fontColor',
      'fontBackgroundColor',

      '|',

      'bold',
      'italic',
      'underline',
      'strikethrough',

      '|',

      'link',

      '|',

      'bulletedList',
      'numberedList',
    ],
  },

  heading: {
    options: [
      {
        model: 'paragraph',
        title: '內文',
        class: 'ck-heading_paragraph',
      },
      {
        model: 'heading1',
        view: 'h1',
        title: '標題一',
        class: 'ck-heading_heading1',
      },
      {
        model: 'heading2',
        view: 'h2',
        title: '標題二',
        class: 'ck-heading_heading2',
      },
    ],
  },

  fontFamily: {
    supportAllValues: true,
    options: [
      'default',
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Microsoft JhengHei',
      '微軟正黑體',
      'PMingLiU',
      '新細明體',
      'Noto Sans TC',
      'Noto Serif TC',
    ],
  },

  fontSize: {
    options: [12, 14, 'default', 16, 18, 20, 24, 28, 32],
    supportAllValues: true,
  },

  fontColor: {
    columns: 6,
  },

  fontBackgroundColor: {
    columns: 6,
  },

  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
  },
};

export default SummaryConfig;
