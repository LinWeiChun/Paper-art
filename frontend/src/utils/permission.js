import { getAuthRoles } from './authSession';

export const hasPermission = (permission) => {
  const roles = getAuthRoles();

  // ADMIN 擁有所有權限
  if (roles.includes('ADMIN')) {
    return true;
  }

  return roles.includes(permission);
};
