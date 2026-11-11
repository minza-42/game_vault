function Footer() {
  function handleBackToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <h3>GameVault</h3>
          <p>Your personal gaming collection. Keep track of every adventure.</p>
        </div>

        <div className="footer__bottom">
          <span>© 2026 GameVault. All rights reserved.</span>

          <a
            href="https://github.com/minza-42/game_vault"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GameVault on GitHub"
          >
            GitHub
          </a>

          <button
            className="footer__back-to-top"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
