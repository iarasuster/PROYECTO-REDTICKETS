/**
 * CHATBOT CON IA Y GENERATIVE UI
 * Integración completa con Groq API y renderizado dinámico
 */

import { useState } from "react";
import ChatUI from "./ChatUI";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className={`chatbot-trigger ${isOpen ? "chatbot-trigger--open" : ""}`}
        onClick={toggleChat}
        aria-label="Abrir chat"
        type="button"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comment"></i>
        )}
      </button>

      {/* Interfaz del chat */}
      <ChatUI isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Chatbot;
