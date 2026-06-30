import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ScrollToTop from './components/common/ScrollToTop';

import About from './pages/About';
import AuthorDetail from './pages/AuthorDetail';
import Authors from './pages/Authors';
import Contact from './pages/Contact';
import Home from './pages/Home';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Rental from './pages/Rental';
import RentalRequest from './pages/RentalRequest';
import RentalWorks from './pages/RentalWorks';
import WorkDetail from './pages/WorkDetail';
import Works from './pages/Works';
import ProtectedRoute from './routes/ProtectedRoute';
import {
  ADMIN_BASE_PATH,
  adminLoginPath,
  isAdminHost,
} from './routes/adminRoutes';

const AdminLayout = lazy(() => import('./layouts/admin/AdminLayout'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/admin/DashBoard'));
const AdminAbout = lazy(() => import('./pages/admin/about/AdminAbout'));
const AdminArtCreate = lazy(() => import('./pages/admin/arts/AdminArtCreate'));
const AdminArtEdit = lazy(() => import('./pages/admin/arts/AdminArtEdit'));
const AdminArts = lazy(() => import('./pages/admin/arts/AdminArts'));
const AdminAuthorCreate = lazy(
  () => import('./pages/admin/authors/AdminAuthorCreate'),
);
const AdminAuthorEdit = lazy(
  () => import('./pages/admin/authors/AdminAuthorEdit'),
);
const AdminAuthors = lazy(() => import('./pages/admin/authors/AdminAuthors'));
const AdminBanners = lazy(() => import('./pages/admin/banner/AdminBanner'));
const AdminBannerCreate = lazy(
  () => import('./pages/admin/banner/AdminBannerCreate'),
);
const AdminBannerEdit = lazy(
  () => import('./pages/admin/banner/AdminBannerEdit'),
);
const AdminCategories = lazy(
  () => import('./pages/admin/categories/AdminCategories'),
);
const AdminCategoryCreate = lazy(
  () => import('./pages/admin/categories/AdminCategoryCreate'),
);
const AdminCategoryEdit = lazy(
  () => import('./pages/admin/categories/AdminCategoryEdit'),
);
const AdminContact = lazy(() => import('./pages/admin/contact/AdminContact'));
const AdminContactDetail = lazy(
  () => import('./pages/admin/contact/AdminContactDetail'),
);
const AdminContactMessage = lazy(
  () => import('./pages/admin/contact/AdminContactMessage'),
);
const AdminNews = lazy(() => import('./pages/admin/news/AdminNews'));
const AdminNewsCreate = lazy(
  () => import('./pages/admin/news/AdminNewsCreate'),
);
const AdminNewsEdit = lazy(() => import('./pages/admin/news/AdminNewsEdit'));
const AdminUser = lazy(() => import('./pages/admin/user/AdminUser'));
const AdminUserCreate = lazy(
  () => import('./pages/admin/user/AdminUserCreate'),
);
const AdminUserEdit = lazy(() => import('./pages/admin/user/AdminUserEdit'));

function App() {
  const adminHost = isAdminHost();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div />}>
        <Routes>
          {adminHost ? (
            <>
              <Route path={adminLoginPath()} element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path={ADMIN_BASE_PATH} element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />

                <Route path="banners" element={<AdminBanners />} />
                <Route path="banners/create" element={<AdminBannerCreate />} />
                <Route path="banners/edit/:id" element={<AdminBannerEdit />} />

                <Route path="about" element={<AdminAbout />} />

                <Route path="news" element={<AdminNews />} />
                <Route path="news/create" element={<AdminNewsCreate />} />
                <Route path="news/edit/:id" element={<AdminNewsEdit />} />

                <Route path="authors" element={<AdminAuthors />} />
                <Route path="authors/create" element={<AdminAuthorCreate />} />
                <Route path="authors/edit/:id" element={<AdminAuthorEdit />} />

                <Route path="categories" element={<AdminCategories />} />
                <Route
                  path="categories/create"
                  element={<AdminCategoryCreate />}
                />
                <Route
                  path="categories/edit/:id"
                  element={<AdminCategoryEdit />}
                />

                <Route path="arts" element={<AdminArts />} />
                <Route path="arts/create" element={<AdminArtCreate />} />
                <Route path="arts/edit/:id" element={<AdminArtEdit />} />

                <Route path="contact" element={<AdminContact />} />
                <Route
                  path="contact-message"
                  element={<AdminContactMessage />}
                />
                <Route
                  path="contact-message/:id"
                  element={<AdminContactDetail />}
                />

                <Route path="users" element={<AdminUser />} />
                <Route path="users/create" element={<AdminUserCreate />} />
                <Route path="users/edit/:id" element={<AdminUserEdit />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/authors/:id" element={<AuthorDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/:id" element={<WorkDetail />} />
            <Route path="/rental" element={<Rental />} />
            <Route path="/rental/works" element={<RentalWorks />} />
            <Route path="/rental/request" element={<RentalRequest />} />

              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
