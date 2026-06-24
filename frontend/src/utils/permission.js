export const hasPermission = (permission) => {
  const roles = JSON.parse(sessionStorage.getItem('roles')) || [];

  // ADMIN 擁有所有權限
  if (roles.includes('ADMIN')) {
    return true;
  }

  return roles.includes(permission);
};
