/**
 * GENERATIVE RENDERER
 * Renderiza UI dinámica según la intención del usuario
 */

import {
  generateUIActions,
  ActionButton,
  ContentCard,
} from "../ai-assistant/generativeActions.jsx";
import "./GenerativeRenderer.css";

const GenerativeRenderer = ({ intent, relatedContent, onQuickAction }) => {
  if (!intent || intent.confidence < 0.5) {
    return null;
  }

  const actions = generateUIActions(intent, relatedContent);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="gen-renderer">
      {/* Renderizar botones de acción */}
      {actions.filter((a) => a.type !== "contentCards").length > 0 && (
        <div className="gen-renderer__actions">
          {actions
            .filter((a) => a.type !== "contentCards")
            .map((action, index) => (
              <ActionButton
                key={index}
                action={action}
                onClick={onQuickAction}
              />
            ))}
        </div>
      )}

      {/* Renderizar cards de contenido */}
      {actions.find((a) => a.type === "contentCards") && (
        <div className="gen-renderer__cards">
          {actions
            .find((a) => a.type === "contentCards")
            .content.map((content, index) => (
              <ContentCard key={content.id || index} content={content} />
            ))}
        </div>
      )}
    </div>
  );
};

export default GenerativeRenderer;
