import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ScrollToTop from './components/common/ScrollToTop';

import AdminLayout from './layouts/admin/AdminLayout';
import About from './pages/About';
import AuthorDetail from './pages/AuthorDetail';
import Authors from './pages/Authors';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Login from './pages/Login';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Rental from './pages/Rental';
import RentalRequest from './pages/RentalRequest';
import RentalWorks from './pages/RentalWorks';
import WorkDetail from './pages/WorkDetail';
import Works from './pages/Works';
import AdminAbout from './pages/admin/about/AdminAbout';
import AdminArtCreate from './pages/admin/arts/AdminArtCreate';
import AdminArtEdit from './pages/admin/arts/AdminArtEdit';
import AdminArts from './pages/admin/arts/AdminArts';
import AdminAuthorCreate from './pages/admin/authors/AdminAuthorCreate';
import AdminAuthorEdit from './pages/admin/authors/AdminAuthorEdit';
import AdminAuthors from './pages/admin/authors/AdminAuthors';
import AdminBanners from './pages/admin/banner/AdminBanner';
import AdminBannerCreate from './pages/admin/banner/AdminBannerCreate';
import AdminBannerEdit from './pages/admin/banner/AdminBannerEdit';
import AdminCategories from './pages/admin/categories/AdminCategories';
import AdminCategoryCreate from './pages/admin/categories/AdminCategoryCreate';
import AdminCategoryEdit from './pages/admin/categories/AdminCategoryEdit';
import AdminContact from './pages/admin/contact/AdminContact';
import AdminContactDetail from './pages/admin/contact/AdminContactDetail';
import AdminContactMessage from './pages/admin/contact/AdminContactMessage';
import Dashboard from './pages/admin/DashBoard';
import AdminNews from './pages/admin/news/AdminNews';
import AdminNewsCreate from './pages/admin/news/AdminNewsCreate';
import AdminNewsEdit from './pages/admin/news/AdminNewsEdit';
import AdminUser from './pages/admin/user/AdminUser';
import AdminUserCreate from './pages/admin/user/AdminUserCreate';
import AdminUserEdit from './pages/admin/user/AdminUserEdit';
import ProtectedRoute from './routes/ProtectedRoute';
import {
  ADMIN_BASE_PATH,
  adminLoginPath,
  isAdminHost,
} from './routes/adminRoutes';

function App() {
  const adminHost = isAdminHost();

  return (
    <BrowserRouter>
      <ScrollToTop />
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
    </BrowserRouter>
  );
}

export default App;
