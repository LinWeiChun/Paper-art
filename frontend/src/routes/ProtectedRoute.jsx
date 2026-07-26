import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { getCurrentUser } from '../api/authApi';
import { clearAuthSession, saveAuthSession } from '../utils/authSession';

import { adminLoginPath } from './adminRoutes';

function ProtectedRoute() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const handleUnauthorized = () => setStatus('unauthenticated');
    window.addEventListener('paperart:unauthorized', handleUnauthorized);

    getCurrentUser()
      .then((response) => {
        saveAuthSession(response.data);
        if (active) setStatus('authenticated');
      })
      .catch(() => {
        clearAuthSession();
        if (active) setStatus('unauthenticated');
      });

    return () => {
      active = false;
      window.removeEventListener('paperart:unauthorized', handleUnauthorized);
    };
  }, []);

  if (status === 'loading') {
    return <div className="route-loading">驗證登入狀態中…</div>;
  }

  return status === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate to={adminLoginPath()} replace />
  );
}

export default ProtectedRoute;
