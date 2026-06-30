import { Navigate, Outlet } from 'react-router-dom';

import { adminLoginPath } from './adminRoutes';

function ProtectedRoute() {
  const token = sessionStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to={adminLoginPath()} replace />;
}

export default ProtectedRoute;
