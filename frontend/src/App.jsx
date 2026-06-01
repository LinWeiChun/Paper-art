import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Authors from './pages/Authors';
import AuthorDetail from './pages/AuthorDetail';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Works from './pages/Works';
import WorkDetail from './pages/WorkDetail';

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
