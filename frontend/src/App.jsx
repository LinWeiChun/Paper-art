import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Authors from './pages/Authors';
import AuthorDetail from './pages/AuthorDetail';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Works from './pages/Works';
import WorkDetail from './pages/WorkDetail';

// 後台
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/DashBoard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNews from './pages/admin/News/AdminNews';
import AdminNewsCreate from './pages/admin/News/AdminNewsCreate';
import AdminNewsEdit from './pages/admin/News/AdminNewsEdit';
import AdminAuthors from './pages/admin/Authors/AdminAuthors';
import AdminAuthorCreate from './pages/admin/Authors/AdminAuthorCreate';
import AdminAuthorEdit from './pages/admin/Authors/AdminAuthorEdit';
import AdminCategories from './pages/admin/Categories/AdminCategories';
import AdminCategoryCreate from './pages/admin/Categories/AdminCategoryCreate';
import AdminCategoryEdit from './pages/admin/Categories/AdminCategoryEdit';
// import AdminArts from './pages/admin/Arts/AdminArts';
// import AdminArtCreate from './pages/admin/Arts/AdminArtCreate';
// import AdminArtEdit from './pages/admin/Arts/AdminArtEdit';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/:id" element={<AuthorDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/works" element={<Works />} />
        <Route path="/works/:id" element={<WorkDetail />} />

        {/* 後台 */}

        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            {/* 最新消息 */}
            <Route path="news" element={<AdminNews />} />
            <Route path="news/create" element={<AdminNewsCreate />} />
            <Route path="news/edit/:id" element={<AdminNewsEdit />} />

            {/* 作者管理 */}
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="authors/create" element={<AdminAuthorCreate />} />
            <Route path="authors/edit/:id" element={<AdminAuthorEdit />} />

            {/* 分類管理 */}
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/create" element={<AdminCategoryCreate />} />
            <Route path="categories/edit/:id" element={<AdminCategoryEdit />} />

            {/* 作品管理 */}
            <Route path="arts" element={<AdminArts />} />
            <Route path="arts/create" element={<AdminArtCreate />} />
            <Route path="arts/edit/:id" element={<AdminArtEdit />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
