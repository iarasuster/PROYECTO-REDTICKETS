/**
 * useStructuredChat Hook
 *
 * Handles streaming text-structured responses from /api/chat-structured
 * Parses AIMessage with archetypes and layers
 */

import { useState, useCallback, useRef } from "react";
import { parseStructuredText } from "../utils/parseStructuredText";

export function useStructuredChat({
  api,
  initialMessages = [],
  onFinish,
} = {}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("ready"); // 'ready' | 'submitting' | 'streaming' | 'error'
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  /**
   * Send a message to the AI
   * Can be called with custom message or from form submit
   */
  const handleSubmit = useCallback(
    async (e) => {
      // Prevenir submit si es un evento de formulario
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      // Extraer mensaje: puede ser string directo o del input
      const messageText = typeof e === "string" ? e : input.trim();

      if (!messageText || status === "submitting" || status === "streaming") {
        return;
      }

      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
      };

      // Add user message
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setStatus("submitting");
      setError(null);

      try {
        abortControllerRef.current = new AbortController();

        // Timeout of 30 seconds
        const timeoutId = setTimeout(() => {
          abortControllerRef.current.abort();
        }, 30000);

        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage]
              .filter(
                (m) =>
                  m.role === "user" ||
                  (m.role === "assistant" &&
                    m.layers &&
                    Object.keys(m.layers).length > 0),
              )
              .map((m) => ({
                role: m.role,
                content: m.role === "user" ? m.content : m.layers.message || "",
              })),
          }),
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setStatus("streaming");

        // Parse streaming text-structured response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedData = "";

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          archetype: null,
          layers: {},
          isStreaming: true,
        };

        // Add placeholder message
        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;

          // Try to parse accumulated text
          try {
            const parsedData = parseStructuredText(accumulatedData.trim());

            if (parsedData.archetype) {
              // Update message with parsed structured data
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? {
                        ...m,
                        archetype: parsedData.archetype,
                        layers: parsedData.layers || {},
                        isStreaming: true,
                      }
                    : m,
                ),
              );
            }
          } catch (parseError) {
            // Text not complete yet, continue accumulating
          }
        }

        // Finalize message
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            lastMsg.isStreaming = false;
          }
          return newMessages;
        });

        setStatus("ready");

        if (onFinish) {
          onFinish();
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error("❌ Error en chat:", err);

        if (err.name === "AbortError") {
          setError("Timeout: La respuesta tardó demasiado");
        } else {
          setError(err.message || "Error desconocido");
        }

        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            archetype: "redirect",
            layers: {
              acknowledge: { text: "Ups, algo salió mal." },
              context: { text: "Por favor intenta de nuevo en un momento." },
            },
            isStreaming: false,
          },
        ]);

        setStatus("error");
      }
    },
    [api, input, messages, status, onFinish],
  );

  /**
   * Send a predefined message (from suggested actions or next steps)
   */
  const sendMessage = useCallback(
    (message) => {
      handleSubmit(message);
    },
    [handleSubmit],
  );

  /**
   * Stop current streaming
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus("ready");
    }
  }, []);

  /**
   * Clear conversation
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setInput("");
    setError(null);
    setStatus("ready");
  }, []);

  return {
    messages,
    input,
    status,
    error,
    handleInputChange,
    handleSubmit,
    sendMessage,
    stop,
    clearMessages,
    isLoading: status === "submitting" || status === "streaming",
  };
}
