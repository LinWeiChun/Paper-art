const BLOCKED_TAGS = new Set([
  'base',
  'embed',
  'form',
  'iframe',
  'link',
  'meta',
  'object',
  'script',
  'style',
]);

const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href', 'action']);
const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:|\/|#)/i;
const ALLOWED_STYLE_PROPERTIES = new Set([
  'background-color',
  'border',
  'border-bottom',
  'border-collapse',
  'border-color',
  'border-left',
  'border-right',
  'border-style',
  'border-top',
  'border-width',
  'color',
  'float',
  'font-size',
  'font-style',
  'font-weight',
  'height',
  'letter-spacing',
  'line-height',
  'margin',
  'margin-left',
  'margin-right',
  'max-height',
  'max-width',
  'padding',
  'text-align',
  'text-decoration',
  'width',
]);
const UNSAFE_STYLE_VALUE_PATTERN =
  /url\s*\(|expression\s*\(|javascript:|vbscript:|data:|@import|var\s*\(/i;
const SAFE_STYLE_VALUE_PATTERN = /^[#(),.%\w\s/-]+$/;

const isUnsafeUrl = (value) => {
  const trimmedValue = value.trim();

  return trimmedValue && !SAFE_URL_PATTERN.test(trimmedValue);
};

const sanitizeStyle = (style = '') => {
  const safeDeclarations = style
    .split(';')
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(':');

      if (separatorIndex === -1) {
        return null;
      }

      const property = declaration
        .slice(0, separatorIndex)
        .trim()
        .toLowerCase();
      const value = declaration.slice(separatorIndex + 1).trim();

      if (
        !ALLOWED_STYLE_PROPERTIES.has(property) ||
        !value ||
        UNSAFE_STYLE_VALUE_PATTERN.test(value) ||
        !SAFE_STYLE_VALUE_PATTERN.test(value)
      ) {
        return null;
      }

      return `${property}: ${value}`;
    })
    .filter(Boolean);

  return safeDeclarations.join('; ');
};

export const sanitizeHtml = (html = '') => {
  if (!html || typeof window === 'undefined') {
    return '';
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  BLOCKED_TAGS.forEach((tagName) => {
    doc.body.querySelectorAll(tagName).forEach((node) => node.remove());
  });

  doc.body.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;

      if (
        name.startsWith('on') ||
        name === 'srcdoc' ||
        (URL_ATTRIBUTES.has(name) && isUnsafeUrl(value))
      ) {
        node.removeAttribute(attribute.name);
      }

      if (name === 'style') {
        const safeStyle = sanitizeStyle(value);

        if (safeStyle) {
          node.setAttribute('style', safeStyle);
        } else {
          node.removeAttribute(attribute.name);
        }
      }
    });
  });

  return doc.body.innerHTML;
};
