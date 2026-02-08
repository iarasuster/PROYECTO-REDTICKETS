/**
 * COMPONENTE CHAT UI - Generative UI con Mensajes Estructurados
 * Arquitectura: Archetypes + Layers + Visual Blocks
 */

import { useStructuredChat } from "../hooks/useStructuredChat";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardList } from "./chatbot/CardList";
import { VideoBlock } from "./chatbot/VideoBlock";
import { SuggestedActions } from "./chatbot/SuggestedActions";
import Icon from "./Icon";
import "./ChatUI.css";

const ChatUI = ({ isOpen, onClose }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar automáticamente la URL del backend según el entorno
  const CHAT_API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/chat-structured"
      : "https://redtickets-backend.vercel.app/api/chat-structured";

  // Hook personalizado para chat con streaming estructurado
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    sendMessage,
    status,
    isLoading,
    error,
    clearMessages,
  } = useStructuredChat({
    api: CHAT_API_URL,
    initialMessages: [],
  });

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handler para acciones sugeridas
  const handleSuggestedAction = (message) => {
    sendMessage(message);
  };

  /**
   * Renderizar Visual Blocks del mensaje
   */
  const renderVisualBlocks = (visualBlocks) => {
    if (!visualBlocks || visualBlocks.length === 0) return null;

    return (
      <div className="chat-ui__visual-content">
        {visualBlocks.map((block, index) => {
          switch (block.type) {
            case "card-list":
              return (
                <CardList
                  key={index}
                  {...block}
                  onAction={(slug) => navigate(`/seccion/${slug}`)}
                />
              );
            case "video":
              return <VideoBlock key={index} {...block} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  /**
   * Renderizar capas de texto (mensaje principal)
   */
  const renderTextLayers = (layers) => {
    if (!layers || !layers.message) return null;

    return (
      <div className="chat-ui__text-layers">
        <p className="chat-ui__message-text">{layers.message}</p>
      </div>
    );
  };

  /**
   * Renderizar Next Steps (botones de acción)
   */
  const renderNextSteps = (actions, isStreaming) => {
    if (!actions || actions.length === 0 || isStreaming) return null;

    return (
      <div className="chat-ui__actions">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`chat-ui__action-btn ${
              action.variant === "secondary"
                ? "chat-ui__action-btn--secondary"
                : ""
            }`}
            onClick={() => {
              if (action.type === "navigate") {
                // Si el valor contiene query params (ej: "ayuda?tab=vender"), usar directamente
                // Si no, usar el formato estándar
                if (action.value.includes("?")) {
                  const [section, query] = action.value.split("?");
                  navigate(`/seccion/${section}?${query}`);
                } else {
                  navigate(`/seccion/${action.value}`);
                }
              } else if (action.type === "external") {
                // Abrir link externo en nueva pestaña
                window.open(action.value, "_blank", "noopener,noreferrer");
              } else if (action.type === "message") {
                sendMessage(action.value);
              }
            }}
          >
            <Icon name="arrow-right" size={16} />
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  const handleClearMessages = () => {
    if (clearMessages) {
      clearMessages();
    }
  };

  const handleQuickAction = (message) => {
    sendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-ui ${isMaximized ? "chat-ui--maximized" : ""}`}>
      {/* Header */}
      <div className="chat-ui__header">
        <div className="chat-ui__header-info">
          <div className="chat-ui__avatar">
            <img
              src="/ISOTIPO.svg"
              alt="RedTickets"
              className="chat-ui__avatar-logo"
            />
          </div>
          <div>
            <h3 className="chat-ui__title">Asistente RedTickets</h3>
            <p className="chat-ui__status">
              {status === "submitting" && "Enviando..."}
              {status === "streaming" && "Escribiendo..."}
              {status === "ready" && "En línea"}
              {status === "error" && "Error de conexión"}
            </p>
          </div>
        </div>
        <div className="chat-ui__header-actions">
          <div className="chat-ui__menu-container">
            <button
              className="chat-ui__icon-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Opciones"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>
            {isMenuOpen && (
              <>
                <div
                  className="chat-ui__menu-backdrop"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="chat-ui__menu-dropdown">
                  <button
                    className="chat-ui__menu-item"
                    onClick={() => {
                      handleClearMessages();
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m3 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6h14z" />
                    </svg>
                    Limpiar chat
                  </button>
                  <button
                    className="chat-ui__menu-item"
                    onClick={() => {
                      setIsMaximized(!isMaximized);
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {isMaximized ? (
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      ) : (
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      )}
                    </svg>
                    {isMaximized ? "Pantalla normal" : "Pantalla completa"}
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            className="chat-ui__icon-btn"
            onClick={onClose}
            title="Cerrar chat"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-ui__messages">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            // Mensaje del usuario
            if (message.role === "user") {
              return (
                <div
                  key={message.id}
                  className="chat-ui__message chat-ui__message--user"
                >
                  <div className="chat-ui__message-content">
                    <p className="chat-ui__message-text">{message.content}</p>
                  </div>
                </div>
              );
            }

            // Mensaje del asistente con capas estructuradas
            const { layers, isStreaming } = message;

            return (
              <div
                key={message.id}
                className="chat-ui__message chat-ui__message--assistant"
              >
                <div className="chat-ui__message-avatar">
                  <img
                    src="/ISOTIPO.svg"
                    alt="RedTickets"
                    className="chat-ui__avatar-logo"
                  />
                </div>

                <div className="chat-ui__message-content">
                  {/* Orden: visual → texto → acciones */}
                  {layers?.visual && renderVisualBlocks(layers.visual)}
                  {renderTextLayers(layers)}
                  {layers?.actions &&
                    renderNextSteps(layers.actions, isStreaming)}

                  {/* Indicador de streaming */}
                  {isStreaming && (
                    <div className="chat-ui__typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <SuggestedActions onSelectAction={handleSuggestedAction} />
        )}

        {/* Typing indicator - solo si status es streaming pero no hay mensaje visible */}
        {status === "streaming" && messages.length === 0 && (
          <div className="chat-ui__message chat-ui__message--assistant">
            <div className="chat-ui__message-avatar">
              <img
                src="/ISOTIPO.svg"
                alt="RedTickets"
                className="chat-ui__avatar-logo"
              />
            </div>
            <div className="chat-ui__typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="chat-ui__error">
            <Icon name="exclamation-triangle" size={18} />
            {error || "Hubo un problema. Por favor, intenta nuevamente."}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form className="chat-ui__input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chat-ui__input"
          placeholder="Escribe tu pregunta..."
          value={input || ""}
          onChange={handleInputChange}
          disabled={status !== "ready"}
        />
        <button
          type="submit"
          className="chat-ui__send-btn"
          disabled={status !== "ready" || !input || input.trim() === ""}
        >
          {status === "submitting" && <Icon name="paper-plane" size={20} />}
          {status === "streaming" && <Icon name="spinner" size={20} />}
          {status === "ready" && <Icon name="paper-plane" size={20} />}
          {status === "error" && <Icon name="exclamation-circle" size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatUI;
