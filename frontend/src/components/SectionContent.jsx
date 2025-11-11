import { useState, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  getContentBySection,
  getContentByTypeAndSection,
} from "../services/api";
import { defaultContent } from "../data/defaultContent";
import loaderAnimation from "../assets/loader.lottie";
import "./SectionContent.css";

const SectionContent = ({ seccion, tipo = null, className = "" }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        let data;

        // Convertir el nombre de la sección a slug (minúsculas y guiones)
        const seccionSlug = seccion.toLowerCase().replace(/\s+/g, "-");

        if (tipo) {
          // Obtener contenido específico por tipo y sección
          data = await getContentByTypeAndSection(tipo, seccionSlug);
        } else {
          // Obtener todo el contenido de la sección
          data = await getContentBySection(seccionSlug);
        }

        // Si no hay contenido en la BD, usar el contenido por defecto
        if (!data.docs || data.docs.length === 0) {
          const defaultData = defaultContent[seccionSlug] || [];
          setContent(
            tipo
              ? defaultData.filter((item) => item.tipo === tipo)
              : defaultData
          );
        } else {
          setContent(data.docs);
        }
      } catch (err) {
        console.error("❌ Error fetching section content:", err);
        // En caso de error, intentar usar contenido por defecto
        const seccionSlug = seccion.toLowerCase().replace(/\s+/g, "-");
        const defaultData = defaultContent[seccionSlug] || [];
        setContent(
          tipo ? defaultData.filter((item) => item.tipo === tipo) : defaultData
        );
      } finally {
        setLoading(false);
      }
    };

    if (seccion) {
      fetchContent();
    }
  }, [seccion, tipo]);

  // Intersection Observer para scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar todos los content-items
    const items = document.querySelectorAll(".content-item");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [content]);

  if (loading) {
    return (
      <div className="section-loading">
        <DotLottieReact
          src={loaderAnimation}
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (!content.length) {
    return null; // No mostrar nada si no hay contenido
  }

  return (
    <div className={`section-content ${className}`}>
      <div className="content-grid">
        {content.map((item) => (
          <ContentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// Componente para renderizar cada item de contenido
const ContentItem = ({ item }) => {
  const renderContent = () => {
    // Convertir rich text a HTML si es necesario
    const htmlContent =
      typeof item.contenido === "string"
        ? item.contenido
        : item.contenido?.root?.children
            ?.map((child, idx) =>
              child.children?.map((text, textIdx) => text.text).join("")
            )
            .join("") || "";

    const imageUrl = item.imagen?.url || item.imagen || null;

    switch (item.tipo) {
      case "tarjeta":
      case "card":
        return (
          <div className="content-item tarjeta">
            {imageUrl && <img src={imageUrl} alt={item.titulo} />}
            <div className="card-body">
              <h3>{item.titulo}</h3>
              {item.subtitulo && (
                <p className="card-subtitle">{item.subtitulo}</p>
              )}
              <p>{htmlContent}</p>
              {item.metadata && (
                <div className="card-meta">
                  {item.metadata.fecha && (
                    <span>
                      <i className="far fa-calendar-alt"></i>{" "}
                      {item.metadata.fecha}
                    </span>
                  )}
                  {item.metadata.lugar && (
                    <span>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {item.metadata.lugar}
                    </span>
                  )}
                  {item.metadata.precio && (
                    <span>
                      <i className="fas fa-credit-card"></i>{" "}
                      {item.metadata.precio}
                    </span>
                  )}
                </div>
              )}
              {item.enlace && (
                <a href={item.enlace} className="btn btn-secondary mt-2">
                  {item.textoEnlace || "Ver más"}
                </a>
              )}
            </div>
          </div>
        );

      case "hero":
      case "banner":
        return (
          <div className="content-item hero">
            {imageUrl && <img src={imageUrl} alt={item.titulo} />}
            <div className="hero-content">
              <h2>{item.titulo}</h2>
              {item.subtitulo && (
                <p className="hero-subtitle">{item.subtitulo}</p>
              )}
              <p>{htmlContent}</p>
              {item.enlace && item.textoEnlace && (
                <a href={item.enlace} className="btn btn-large">
                  {item.textoEnlace}
                </a>
              )}
            </div>
          </div>
        );

      case "servicio":
      case "caracteristica":
        return (
          <div className="content-item servicio">
            <h3>{item.titulo}</h3>
            <p>{htmlContent}</p>
            {item.enlace && (
              <a href={item.enlace} className="btn btn-secondary">
                {item.textoEnlace || "Más información"}
              </a>
            )}
          </div>
        );

      case "testimonio":
        return (
          <div className="content-item testimonio">
            <p className="testimonio-texto">"{htmlContent}"</p>
            <div className="testimonio-autor">
              {item.metadata?.autor || item.titulo}
            </div>
            {item.metadata?.cargo && (
              <div className="testimonio-cargo">{item.metadata.cargo}</div>
            )}
            {item.metadata?.calificacion && (
              <div className="testimonio-rating">
                {"★".repeat(item.metadata.calificacion)}
                {"☆".repeat(5 - item.metadata.calificacion)}
              </div>
            )}
          </div>
        );

      case "faq":
        return (
          <div className="content-item faq">
            <div className="faq-pregunta">{item.titulo}</div>
            <div className="faq-respuesta">{htmlContent}</div>
          </div>
        );

      case "lista":
        return (
          <div className="content-item lista">
            <h3>{item.titulo}</h3>
            <ul>
              {htmlContent
                .split("\n")
                .map(
                  (line, idx) => line.trim() && <li key={idx}>{line.trim()}</li>
                )}
            </ul>
          </div>
        );

      case "texto":
      case "parrafo":
        return (
          <div className="content-item texto">
            <h3>{item.titulo}</h3>
            {item.subtitulo && <h4>{item.subtitulo}</h4>}
            <p>{htmlContent}</p>
          </div>
        );

      case "formulario":
      case "contacto":
        return (
          <div className="content-item formulario">
            <h3>{item.titulo}</h3>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Nombre / Empresa</label>
                <input type="text" placeholder="Tu nombre o empresa" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="tu@email.com" />
              </div>
              {item.seccion === "comunidad" ? (
                <div className="form-group">
                  <label>Comentario</label>
                  <textarea placeholder="Contanos tu experiencia"></textarea>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Tipo de evento o proyecto</label>
                    <input
                      type="text"
                      placeholder="Ej. festival, concierto, congreso"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mensaje</label>
                    <textarea placeholder="Contanos un poco sobre tu evento"></textarea>
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-large">
                Enviar mensaje
              </button>
            </form>
            {htmlContent && (
              <div
                className="contacto-info"
                style={{ marginTop: "1.5rem" }}
                dangerouslySetInnerHTML={{
                  __html: htmlContent.replace(/\n/g, "<br />"),
                }}
              />
            )}
          </div>
        );

      default:
        return (
          <div className="content-item texto">
            <h3>{item.titulo}</h3>
            {item.subtitulo && <h4>{item.subtitulo}</h4>}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={item.titulo}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <p>{htmlContent}</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default SectionContent;
