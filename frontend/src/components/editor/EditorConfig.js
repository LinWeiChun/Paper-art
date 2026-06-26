// src/components/editor/EditorConfig.js

import {
  AutoImage,
  BlockQuote,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  SourceEditing,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  Underline,
  Undo,
} from 'ckeditor5';

import ImageLibraryPlugin from './plugins/ImageLibraryPlugin';
import UploadAdapterPlugin from './plugins/UploadAdapter';

const EditorConfig = {
  licenseKey: 'GPL',

  language: 'zh-tw',

  plugins: [
    Essentials,

    Paragraph,
    Heading,

    Bold,
    Italic,
    Underline,
    Strikethrough,

    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,

    Link,
    List,
    BlockQuote,

    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,

    Image,
    ImageToolbar,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageUpload,
    AutoImage,

    Undo,
    SourceEditing,
  ],

  extraPlugins: [UploadAdapterPlugin, ImageLibraryPlugin],

  toolbar: {
    shouldNotGroupWhenFull: true,

    items: [
      'undo',
      'redo',

      '|',

      'sourceEditing',

      '|',

      'heading',

      '|',

      'fontFamily',
      'fontSize',
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

      '|',

      'blockQuote',

      '|',

      'insertTable',

      '|',

      'uploadImage',
      'imageLibrary',
    ],
  },

  heading: {
    options: [
      {
        model: 'paragraph',
        title: '段落',
        class: 'ck-heading_paragraph',
      },
      {
        model: 'heading1',
        view: 'h1',
        title: '標題 1',
        class: 'ck-heading_heading1',
      },
      {
        model: 'heading2',
        view: 'h2',
        title: '標題 2',
        class: 'ck-heading_heading2',
      },
      {
        model: 'heading3',
        view: 'h3',
        title: '標題 3',
        class: 'ck-heading_heading3',
      },
    ],
  },

  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',

      '|',

      'toggleImageCaption',
      'imageTextAlternative',
    ],

    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: '原始',
        value: null,
      },
      {
        name: 'resizeImage:50',
        label: '50%',
        value: '50',
      },
      {
        name: 'resizeImage:75',
        label: '75%',
        value: '75',
      },
      {
        name: 'resizeImage:100',
        label: '100%',
        value: '100',
      },
    ],

    resizeUnit: '%',
  },

  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties',
    ],
  },

  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
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
    options: [10, 12, 14, 'default', 16, 18, 20, 24, 28, 32, 40],

    supportAllValues: true,
  },

  fontColor: {
    columns: 6,
  },

  fontBackgroundColor: {
    columns: 6,
  },
};

export default EditorConfig;
