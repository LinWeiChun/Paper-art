import Footer from '../components/common/Footer';
import Header from '../components/common/Header';

function Layout({ children }) {
  return (
    <>
      <Header />

      <main className="page-content">{children}</main>

      <Footer />
    </>
  );
}

export default Layout;
