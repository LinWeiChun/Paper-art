const USERNAME_KEY = 'username';
const ROLES_KEY = 'roles';

export const saveAuthSession = ({ username, roles }) => {
  sessionStorage.setItem(USERNAME_KEY, username);
  sessionStorage.setItem(ROLES_KEY, JSON.stringify(roles || []));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(USERNAME_KEY);
  sessionStorage.removeItem(ROLES_KEY);
};

export const getAuthRoles = () => {
  try {
    return JSON.parse(sessionStorage.getItem(ROLES_KEY)) || [];
  } catch {
    return [];
  }
};
