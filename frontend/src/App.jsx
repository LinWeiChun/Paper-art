

// 後台

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
