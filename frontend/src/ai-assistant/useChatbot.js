/**
 * HOOK REACT PARA GESTIÓN DEL CHATBOT
 * Maneja estado, historial y lógica del chat
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { sendMessageToAI, queryPayloadContent } from "./chatbot";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy el asistente virtual de RedTickets. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toISOString(),
      intent: { type: "greeting", confidence: 1 },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const conversationHistoryRef = useRef([]);

  /**
   * Enviar mensaje del usuario
   */
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Obtener respuesta de la IA
      const response = await sendMessageToAI(
        userMessage,
        conversationHistoryRef.current
      );

      // Agregar a historial
      conversationHistoryRef.current.push(
        { role: "user", content: userMessage },
        { role: "assistant", content: response.text }
      );

      // Limitar historial a últimos 10 mensajes
      if (conversationHistoryRef.current.length > 10) {
        conversationHistoryRef.current =
          conversationHistoryRef.current.slice(-10);
      }

      // Consultar contenido relacionado de Payload si es relevante
      let relatedContent = [];
      if (
        response.intent.type === "services" ||
        response.intent.type === "events"
      ) {
        relatedContent = await queryPayloadContent(userMessage);
      }

      // Agregar respuesta del asistente
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.text,
        timestamp: response.timestamp,
        intent: response.intent,
        relatedContent: relatedContent,
        isFallback: response.isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("❌ Error enviando mensaje:", err);
      setError(
        "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo."
      );

      // Mensaje de error
      const errorMsg = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Disculpa, tuve un problema técnico. ¿Podrías reformular tu pregunta?",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpiar conversación
   */
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy el asistente virtual de RedTickets. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date().toISOString(),
        intent: { type: "greeting", confidence: 1 },
      },
    ]);
    conversationHistoryRef.current = [];
    setError(null);
  }, []);

  /**
   * Agregar mensaje de sugerencia rápida
   */
  const sendQuickAction = useCallback(
    async (action) => {
      const quickMessages = {
        services: "¿Qué servicios ofrece RedTickets?",
        contact: "¿Cómo puedo contactar a RedTickets?",
        about: "Cuéntame sobre RedTickets",
        help: "¿Cómo funciona la plataforma?",
      };

      const message = quickMessages[action] || action;
      await sendMessage(message);
    },
    [sendMessage]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    sendQuickAction,
  };
};

export default useChatbot;
