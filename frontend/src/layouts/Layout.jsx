import BackToTopButton from '../components/common/BackToTopButton';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import ScrollToTop from '../components/common/ScrollToTop';

function Layout({ children }) {
  return (
    <>
      <ScrollToTop />

      <Header />

      <main className="page-content">{children}</main>

      <Footer />

      <BackToTopButton />
    </>
  );
}

export default Layout;
