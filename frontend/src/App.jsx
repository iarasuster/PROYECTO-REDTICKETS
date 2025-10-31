import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import SectionPage from "./pages/SectionPage";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        {/* Overlay para móvil */}
        {isMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Header del sitio */}
        <header className="app-header">
          <div className="container">
            <h1 className="site-title">
              <a href="/">
                <img src="/LOGO_1.svg" alt="RedTickets" className="site-logo" />
              </a>
            </h1>

            {/* Botón hamburguesa para móviles */}
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Navegación principal */}
            <nav className={`main-nav ${isMenuOpen ? "mobile-open" : ""}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
              <Link
                to="/seccion/sobre-nosotros"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/seccion/servicios"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                to="/seccion/comunidad"
                onClick={() => setIsMenuOpen(false)}
              >
                Comunidad
              </Link>
              <Link to="/seccion/ayuda" onClick={() => setIsMenuOpen(false)}>
                Ayuda
              </Link>
              <Link to="/seccion/contacto" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seccion/:seccionSlug" element={<SectionPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="container">
            <h3 className="footer-title">Mantente actualizado</h3>
            <p className="mb-3">
              Recibe las mejores noticias de eventos en tu correo
            </p>

            <form className="footer-form">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="footer-input"
              />
              <button type="submit" className="btn btn-large">
                Suscribirme
              </button>
            </form>

            <div className="footer-social">
              <a href="#facebook">Facebook</a>
              <a href="#twitter">Twitter</a>
              <a href="#instagram">Instagram</a>
              <a href="#linkedin">LinkedIn</a>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2025 RedTickets. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Chatbot flotante */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
