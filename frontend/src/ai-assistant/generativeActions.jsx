/**
 * GENERATIVE UI - ACCIONES DINÁMICAS
 * Genera componentes React dinámicamente según el contexto
 * Inspirado en Vercel AI SDK y thesys.dev
 */

import { useNavigate } from "react-router-dom";

/**
 * Genera acciones UI según la intención detectada
 */
export const generateUIActions = (intent, relatedContent = []) => {
  const actions = [];

  switch (intent.type) {
    case "services":
      actions.push({
        type: "navigate",
        label: "Ver todos los servicios",
        icon: "⚙️",
        path: "/seccion/servicios",
        variant: "primary",
      });
      actions.push({
        type: "navigate",
        label: "Contactar para más info",
        icon: "✉️",
        path: "/seccion/contacto",
        variant: "secondary",
      });
      break;

    case "contact":
      actions.push({
        type: "navigate",
        label: "Ir a Contacto",
        icon: "📧",
        path: "/seccion/contacto",
        variant: "primary",
      });
      actions.push({
        type: "external",
        label: "Enviar email directo",
        icon: "✉️",
        url: "mailto:contacto@redtickets.net",
        variant: "secondary",
      });
      break;

    case "events":
      actions.push({
        type: "navigate",
        label: "Ver casos de éxito",
        icon: "🎉",
        path: "/seccion/comunidad",
        variant: "primary",
      });
      actions.push({
        type: "navigate",
        label: "Nuestros servicios",
        icon: "⚡",
        path: "/seccion/servicios",
        variant: "secondary",
      });
      break;

    case "help":
      actions.push({
        type: "navigate",
        label: "Centro de ayuda",
        icon: <i className="fas fa-question-circle"></i>,
        path: "/seccion/ayuda",
        variant: "primary",
      });
      actions.push({
        type: "quickAction",
        label: "¿Cómo contactar?",
        icon: <i className="fas fa-phone"></i>,
        action: "contact",
        variant: "secondary",
      });
      break;

    case "about":
      actions.push({
        type: "navigate",
        label: "Conocer RedTickets",
        icon: "❤️",
        path: "/seccion/sobre-nosotros",
        variant: "primary",
      });
      actions.push({
        type: "navigate",
        label: "Nuestra comunidad",
        icon: "🌍",
        path: "/seccion/comunidad",
        variant: "secondary",
      });
      break;

    default:
      // Acciones genéricas
      actions.push({
        type: "quickAction",
        label: "Ver servicios",
        icon: "⚙️",
        action: "services",
        variant: "secondary",
      });
      break;
  }

  // Si hay contenido relacionado, agregar cards
  if (relatedContent && relatedContent.length > 0) {
    actions.push({
      type: "contentCards",
      content: relatedContent.slice(0, 3), // Máximo 3 cards
    });
  }

  return actions;
};

/**
 * Componente de botón de acción
 */
export const ActionButton = ({ action, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (action.type) {
      case "navigate":
        navigate(action.path);
        break;
      case "external":
        window.open(action.url, "_blank");
        break;
      case "quickAction":
        onClick && onClick(action.action);
        break;
      default:
        break;
    }
  };

  return (
    <button
      className={`gen-ui-button gen-ui-button--${action.variant || "primary"}`}
      onClick={handleClick}
      type="button"
    >
      {action.icon && (
        <span className="gen-ui-button__icon">{action.icon}</span>
      )}
      <span className="gen-ui-button__label">{action.label}</span>
    </button>
  );
};

/**
 * Componente de card de contenido
 */
export const ContentCard = ({ content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/seccion/${content.seccion}`);
  };

  return (
    <div className="gen-ui-card" onClick={handleClick}>
      <h4 className="gen-ui-card__title">{content.titulo}</h4>
      {content.subtitulo && (
        <p className="gen-ui-card__subtitle">{content.subtitulo}</p>
      )}
      {content.contenido && (
        <p className="gen-ui-card__excerpt">
          {typeof content.contenido === "string"
            ? content.contenido.substring(0, 100) + "..."
            : "Ver más"}
        </p>
      )}
      <span className="gen-ui-card__cta">Ver más →</span>
    </div>
  );
};

/**
 * Acciones rápidas predefinidas
 */
export const quickActions = [
  {
    id: "services",
    label: "Servicios",
    icon: <i className="fas fa-cogs"></i>,
    action: "services",
  },
  {
    id: "contact",
    label: "Contacto",
    icon: <i className="fas fa-envelope"></i>,
    action: "contact",
  },
  {
    id: "about",
    label: "Sobre nosotros",
    icon: <i className="fas fa-info-circle"></i>,
    action: "about",
  },
  {
    id: "help",
    label: "Ayuda",
    icon: <i className="fas fa-question-circle"></i>,
    action: "help",
  },
];

export default {
  generateUIActions,
  ActionButton,
  ContentCard,
  quickActions,
};
