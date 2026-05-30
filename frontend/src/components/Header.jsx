import Navbar from './Navbar';

function Header({ menuOpen, setMenuOpen }) {
  return (
    <header className="home-header">
      <h1 className="site-title">李煥章剪紙藝術</h1>

      <button
        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Navbar menuOpen={menuOpen} />
    </header>
  );
}

export default Header;