import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionContent from "../components/SectionContent";
import SkeletonLoader from "../components/SkeletonLoader";
import { getSectionBySlug } from "../services/api";
import "./SectionPage.css";

// Mapeo de slugs de URL a nombres de sección en Payload
const SECTION_NAMES = {
  inicio: "Inicio",
  "sobre-nosotros": "Sobre Nosotros",
  servicios: "Servicios",
  comunidad: "Comunidad",
  ayuda: "Ayuda",
  contacto: "Contacto",
};

function SectionPage() {
  const { seccionSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el nombre de la sección desde el mapeo
  const seccionName = SECTION_NAMES[seccionSlug];

  useEffect(() => {
    // Validar que la sección existe
    if (!seccionName) {
      setError("La sección solicitada no existe.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [seccionSlug, seccionName]);

  if (loading) {
    return (
      <div className="section-page" data-section={seccionSlug}>
        <div className="container">
          <SkeletonLoader variant="hero" />
        </div>
      </div>
    );
  }

  if (error || !seccionName) {
    return (
      <div className="section-page">
        <div className="container">
          <div className="error-message">
            <h2>
              <i className="fas fa-exclamation-triangle"></i> Sección no
              encontrada
            </h2>
            <p>{error || "La sección que buscas no existe."}</p>
            <a href="/" className="btn-primary">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Subtítulos para cada sección
  const getSubtitle = (slug) => {
    const subtitles = {
      inicio:
        "La plataforma líder en venta de entradas para eventos en Uruguay",
      "sobre-nosotros": "Conectamos personas con experiencias únicas",
      servicios: "Soluciones integrales para eventos de todo tipo",
      comunidad: "Lo mejor de RedTickets está en quienes confían en nosotros",
      ayuda: "Resolvemos tus dudas para que solo te preocupes por disfrutar",
      contacto: "Estamos para ayudarte en lo que necesites",
    };
    return subtitles[slug] || "";
  };

  return (
    <div className="section-page" data-section={seccionSlug}>
      <div className="container">
        {/* Hero de la sección */}
        <div className="section-hero">
          <h1 className="section-title">{seccionName}</h1>
          {seccionSlug !== "inicio" && (
            <p className="section-description">{getSubtitle(seccionSlug)}</p>
          )}
        </div>

        <SectionContent seccion={seccionSlug} />
      </div>
    </div>
  );
}

export default SectionPage;
