import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionContent from "../components/SectionContent";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loaderAnimation from "../components/../assets/loader.lottie";
import { getSectionBySlug } from "../services/api";
import "./SectionPage.css";

// Mapeo de slugs de URL a nombres de sección en Payload
const SECTION_NAMES = {
  inicio: "Inicio",
  "sobre-nosotros": "Quiénes Somos",
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
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <DotLottieReact
            src={loaderAnimation}
            autoplay
            loop
            style={{ width: 220, height: 220 }}
          />
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
      "sobre-nosotros": "Conectamos personas con experiencias únicas",
      servicios: "Aqui encontraras todo lo que necesitas para tu evento",
      comunidad: "Lo mejor de RedTickets está en quienes confían en nosotros",
      ayuda: "Resolvemos tus dudas para que solo te preocupes por disfrutar",
      contacto: "Estamos para ayudarte en lo que necesites",
    };
    return subtitles[slug] || "";
  };

  // Renderizar título con palabras destacadas en naranja
  const renderTitle = (slug, name) => {
    const titleConfig = {
      "sobre-nosotros": { white: "Más que una", orange: "ticketera" },
      servicios: { white: "Soluciones completas para", orange: "tu evento" },
      comunidad: { white: "Nuestra", orange: "Comunidad" },
      ayuda: { white: "¿Tenés dudas?", orange: "Estamos para ayudarte" },
      contacto: { white: "¿Querés organizar un evento con", orange: "RedTickets?" },
    };

    const config = titleConfig[slug];
    if (!config) {
      return <h1 className="section-title">{name}</h1>;
    }

    return (
      <h1 className="section-title">
        {config.white}{" "}
        <span className="title-highlight">{config.orange}</span>
      </h1>
    );
  };

  return (
    <div className="section-page" data-section={seccionSlug}>
      <div className="container">
        {/* Hero de la sección */}
        <div className="section-hero">
          {renderTitle(seccionSlug, seccionName)}
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
