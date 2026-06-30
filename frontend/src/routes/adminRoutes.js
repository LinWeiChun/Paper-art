const DEFAULT_ADMIN_HOST = 'admin.paper-cut.org';
const DEFAULT_ADMIN_BASE_PATH = '/panel';

const normalizeBasePath = (path) => {
  const value = path?.trim() || DEFAULT_ADMIN_BASE_PATH;
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;

  return withLeadingSlash.replace(/\/+$/, '') || DEFAULT_ADMIN_BASE_PATH;
};

export const ADMIN_HOST =
  import.meta.env.VITE_ADMIN_HOST || DEFAULT_ADMIN_HOST;

export const ADMIN_BASE_PATH = normalizeBasePath(
  import.meta.env.VITE_ADMIN_BASE_PATH,
);

export const isAdminHost = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.hostname === ADMIN_HOST;
};

export const adminPath = (path = '') => {
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

  return cleanPath ? `${ADMIN_BASE_PATH}/${cleanPath}` : ADMIN_BASE_PATH;
};

export const adminLoginPath = () => (isAdminHost() ? '/' : adminPath('login'));
