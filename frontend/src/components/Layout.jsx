import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <>
      <Header />

      <main className="page-content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;