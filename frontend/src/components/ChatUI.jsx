/**
 * COMPONENTE CHAT UI - Vercel AI SDK
 * Interfaz visual del chatbot con streaming de respuestas
 */

import { useSimpleChat } from "../hooks/useSimpleChat";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenerativeRenderer from "./GenerativeRenderer";
import "./ChatUI.css";

const ChatUI = ({ isOpen, onClose }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Hook personalizado para chat con streaming
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status, // ✅ Usar status granular
    isLoading, // ✅ Mantener para backward compatibility
    error,
    setMessages,
  } = useSimpleChat({
    api: import.meta.env.VITE_CHAT_API_URL || "http://localhost:3000/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy el asistente de RedTickets. ¿En qué puedo ayudarte hoy?",
      },
    ],
    // 📊 Callback para analytics (opcional)
    onFinish: ({ message, duration }) => {
      console.log(`✅ Respuesta completada en ${duration}ms`);
      // Aquí podrías enviar analytics a tu backend
      // analytics.track('chat_response', { duration, messageLength: message.content.length });
    },
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

  const handleClearMessages = () => {
    if (setMessages) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "¡Hola! Soy el asistente de RedTickets. ¿En qué puedo ayudarte hoy?",
        },
      ]);
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      services: "¿Qué servicios ofrece RedTickets?",
      contact: "¿Cómo puedo contactar a RedTickets?",
      events: "Quiero saber sobre eventos",
      about: "Cuéntame sobre RedTickets",
      help: "Necesito ayuda",
    };

    const message = actionMessages[action] || action;
    if (handleSubmit) {
      handleSubmit({ preventDefault: () => {} }, { data: { message } });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-ui">
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
          <button
            className="chat-ui__icon-btn"
            onClick={handleClearMessages}
            title="Nueva conversación"
            type="button"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
          <button
            className="chat-ui__icon-btn"
            onClick={onClose}
            title="Cerrar chat"
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-ui__messages">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-ui__message chat-ui__message--${message.role}`}
            >
              {message.role === "assistant" && (
                <div className="chat-ui__message-avatar">
                  <img
                    src="/ISOTIPO.svg"
                    alt="RedTickets"
                    className="chat-ui__avatar-logo"
                  />
                </div>
              )}

              <div className="chat-ui__message-content">
                <p className="chat-ui__message-text">{message.content}</p>

                {/* Botones de navegación generados dinámicamente */}
                {message.role === "assistant" &&
                  message.actions &&
                  message.actions.length > 0 && (
                    <div className="chat-ui__actions">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          className="chat-ui__action-btn"
                          onClick={() => {
                            navigate(action.path);
                            // ✅ NO cerrar el chat - dejar que el usuario siga conversando
                          }}
                        >
                          <i className="fas fa-arrow-right"></i>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Generative UI - solo para mensajes del asistente (legacy) */}
                {message.role === "assistant" && message.intent && (
                  <GenerativeRenderer
                    intent={message.intent}
                    relatedContent={message.relatedContent}
                    onQuickAction={handleQuickAction}
                  />
                )}
              </div>

              {message.role === "user" && (
                <div className="chat-ui__message-avatar">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="chat-ui__empty">
            <p>Esperando mensajes...</p>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && (
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
            <i className="fas fa-exclamation-triangle"></i>{" "}
            {error.message ||
              "Hubo un problema. Por favor, intenta nuevamente."}
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
          {status === "submitting" && <i className="fas fa-paper-plane"></i>}
          {status === "streaming" && <i className="fas fa-spinner fa-spin"></i>}
          {status === "ready" && <i className="fas fa-paper-plane"></i>}
          {status === "error" && <i className="fas fa-exclamation-circle"></i>}
        </button>
      </form>
    </div>
  );
};

export default ChatUI;
