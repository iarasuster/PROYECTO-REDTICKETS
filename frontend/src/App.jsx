import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import SectionPage from "./pages/SectionPage";
import Chatbot from "./components/Chatbot";
import { startKeepAlive, stopKeepAlive } from "./utils/keepalive";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep-alive para mantener backend despierto
  useEffect(() => {
    startKeepAlive();
    return () => stopKeepAlive();
  }, []);

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

            {/* Navegación principal - Desktop */}
            <nav className="main-nav desktop-nav">
              <NavLink to="/seccion/sobre-nosotros">Sobre Nosotros</NavLink>
              <NavLink to="/seccion/servicios">Servicios</NavLink>
              <NavLink to="/seccion/comunidad">Comunidad</NavLink>
              <NavLink to="/seccion/ayuda">Ayuda</NavLink>
              <NavLink to="/seccion/contacto">Contacto</NavLink>
            </nav>

            {/* Botón CTA principal */}
            <a
              className="cta-button"
              href="https://redtickets.uy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver eventos
            </a>

            {/* Hamburger para móvil */}
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Navegación móvil - Sidebar */}
          <nav className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
            <NavLink
              to="/seccion/sobre-nosotros"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </NavLink>
            <NavLink
              to="/seccion/servicios"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </NavLink>
            <NavLink
              to="/seccion/comunidad"
              onClick={() => setIsMenuOpen(false)}
            >
              Comunidad
            </NavLink>
            <NavLink to="/seccion/ayuda" onClick={() => setIsMenuOpen(false)}>
              Ayuda
            </NavLink>
            <NavLink
              to="/seccion/contacto"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </NavLink>
          </nav>
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
            <h3 className="footer-title">Mantenete actualizado</h3>
            <p className="footer-subtitle">
              Recibe las mejores noticias de eventos en tu correo
            </p>

            <form className="footer-form" onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/formularios`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tipo: 'newsletter', email })
                });
                
                if (response.ok) {
                  alert('¡Gracias por suscribirte! 🎉');
                  e.target.reset();
                } else {
                  alert('Error al suscribirse. Intenta nuevamente.');
                }
              } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Intenta nuevamente.');
              }
            }}>
              <input
                type="email"
                name="email"
                placeholder="Tu correo electrónico"
                className="footer-input"
                required
              />
              <button type="submit" className="btn btn-large">
                Suscribirme
              </button>
            </form>

            <div className="footer-social">
              <a href="https://www.youtube.com/@redtickets8280" target="_blank" rel="noopener noreferrer">Youtube</a>
              <a href="https://x.com/RedTicketsUY" target="_blank" rel="noopener noreferrer">X</a>
              <a href="https://www.instagram.com/redtickets.uy/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/redtickets/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2026 RedTickets. Todos los derechos reservados.</p>
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
