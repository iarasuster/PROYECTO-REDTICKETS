/**
 * Hook personalizado para chat con streaming
 * Compatible con Vercel AI SDK backend
 */

import { useState, useCallback, useRef } from "react";

/**
 * Parsea comandos [ACTION:...] del texto y los convierte en acciones de UI
 * Formato: [ACTION:navigate:section|Label del botón]
 *
 * LÍMITE: Máximo 2 acciones según OpenAI Design Guidelines
 * "Limit primary actions per card: Support up to two actions maximum"
 */
function parseActions(text) {
  // ✅ Actualizado: ahora acepta guiones en el slug (sobre-nosotros, etc)
  const actionRegex = /\[ACTION:navigate:([\w-]+)\|([^\]]+)\]/g;
  const actions = [];
  let match;

  // Extraer todas las acciones
  while ((match = actionRegex.exec(text)) !== null) {
    actions.push({
      type: "navigate",
      section: match[1],
      label: match[2],
      path: `/seccion/${match[1]}`,
    });
  }

  // 🎯 LÍMITE: Solo las primeras 2 acciones (OpenAI guideline)
  const limitedActions = actions.slice(0, 2);

  // Remover los comandos del texto
  const cleanText = text.replace(actionRegex, "").trim();

  return {
    text: cleanText,
    actions: limitedActions,
  };
}

export function useSimpleChat({ api, initialMessages = [], onFinish } = {}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  // 🎯 Estados granulares según Vercel AI SDK docs
  const [status, setStatus] = useState("ready"); // 'ready' | 'submitting' | 'streaming' | 'error'
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();

      if (!input.trim() || status === "submitting" || status === "streaming")
        return;

      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
      };

      // Agregar mensaje del usuario
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setStatus("submitting"); // 📤 Enviando request
      setError(null);
      startTimeRef.current = Date.now(); // ⏱️ Iniciar timer

      try {
        abortControllerRef.current = new AbortController();

        // ⏱️ Timeout de 30 segundos
        const timeoutId = setTimeout(() => {
          abortControllerRef.current.abort();
        }, 30000);

        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timeoutId); // Cancelar timeout si la respuesta llega a tiempo

        if (!response.ok) {
          const errorText = await response.text();
          if (import.meta.env.DEV)
            console.error("❌ Error del servidor:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`,
          );
        }

        // Verificar que el content-type es text/event-stream o text/plain
        const contentType = response.headers.get("content-type");

        setStatus("streaming"); // 🌊 Stream comenzó

        // Leer el stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          actions: [], // Agregar array para acciones de UI
        };

        // Agregar mensaje vacío del asistente
        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // El stream de texto viene directamente, sin prefijos
          assistantMessage.content += chunk;

          // Actualizar el mensaje con el nuevo contenido
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...assistantMessage };
            return newMessages;
          });
        }

        // Una vez completado el stream, parsear acciones
        const parsedMessage = parseActions(assistantMessage.content);
        assistantMessage.content = parsedMessage.text;
        assistantMessage.actions = parsedMessage.actions;

        // 🚫 Si el contenido está vacío y no hay acciones, no mostrar el mensaje
        if (!parsedMessage.text.trim() && parsedMessage.actions.length === 0) {
          // Remover el mensaje vacío
          setMessages((prev) => prev.slice(0, -1));
          setStatus("ready");
          return;
        }

        // Actualizar mensaje final con acciones parseadas
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });

        // ✅ Callback onFinish con duración y mensaje
        const duration = Date.now() - startTimeRef.current;
        setStatus("ready"); // ✅ Listo para nuevo mensaje

        if (onFinish && typeof onFinish === "function") {
          onFinish({
            message: assistantMessage,
            duration,
            messages: messages.concat([userMessage, assistantMessage]),
          });
        }
      } catch (err) {
        if (err.name === "AbortError") {
          setStatus("ready");

          // Agregar mensaje de timeout
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content:
                "⏱️ La solicitud tardó demasiado. El servidor puede estar ocupado. Intenta de nuevo.",
            },
          ]);
        } else {
          setError(err);
          setStatus("error");

          // Agregar mensaje de error
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content:
                "❌ Error de conexión. Verifica tu internet e intenta nuevamente.",
            },
          ]);
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [input, status, messages, api, onFinish],
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status, // ✅ Devolver status en lugar de isLoading
    isLoading: status === "submitting" || status === "streaming", // ✅ Backward compatibility
    error,
    setMessages,
  };
}
