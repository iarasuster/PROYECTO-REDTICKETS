// URL base de la API de Payload CMS
// Usa variable de entorno o fallback a Render
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://redtickets-backend.vercel.app/api";

// URL base del servidor (sin /api) para archivos media
export const SERVER_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://redtickets-backend.vercel.app");

// Configuración del chatbot
const CHATBOT_API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://redtickets-backend.vercel.app/api"
    : "https://redtickets-backend.onrender.com/api";

// Función helper para hacer peticiones HTTP
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (import.meta.env.DEV) console.error("API Error:", error);
    throw error;
  }
};

// ===== FUNCIONES PARA CONTENIDO DEL BLOG =====

// Función para obtener TODO el contenido del blog
export const getAllContent = async () => {
  return fetchAPI("/contenido-blog?limit=100&depth=2");
};

// Función para obtener contenido por sección desde ContenidoBlog
export const getContentBySection = async (seccion) => {
  // IMPORTANTE: El filtro where de Payload tiene bugs
  // Mejor estrategia: obtener TODOS los documentos y filtrar en el cliente
  // depth=2 permite cargar las relaciones de imágenes (upload fields)
  const result = await fetchAPI(`/contenido-blog?limit=100&depth=2`);

  // Filtrar manualmente por sección
  if (result.docs && result.docs.length > 0) {
    const doc = result.docs.find((d) => d.seccion === seccion);

    if (doc) {
      return {
        success: true,
        data: doc,
        fullDoc: doc,
      };
    }
  }

  return {
    success: false,
    data: {},
  };
};

// Función para obtener todas las secciones
export const getAllSections = async () => {
  return fetchAPI("/contenido-blog?limit=100&depth=2");
};

// Función para obtener una sección por su slug
export const getSectionBySlug = async (slug) => {
  const query = new URLSearchParams({
    where: JSON.stringify({
      seccion: { equals: slug },
    }),
    limit: "1",
    depth: "2",
  });

  const response = await fetchAPI(`/contenido-blog?${query}`);
  return response.docs?.[0] || null;
};

// Función para obtener contenido específico por tipo y sección
// NOTA: Con la nueva estructura ContenidoBlog, el contenido está organizado por sección
// Esta función ahora retorna el contenido completo de una sección
export const getContentByTypeAndSection = async (tipoContenido, seccion) => {
  // Mapear el nombre de sección a slug (ej: "sobre-nosotros")
  const seccionSlug = seccion.toLowerCase().replace(/\s+/g, "-");

  const result = await getContentBySection(seccionSlug);

  // Retornar el contenido de la sección
  // El tipo ya no es relevante con la nueva estructura
  return result;
};

// ===== FUNCIONES DEL CHATBOT CON IA =====

// Función para enviar mensaje al chatbot inteligente
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        conversationHistory: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.response || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return {
      success: true,
      response: data.response,
      timestamp: data.timestamp,
    };
  } catch (error) {
    if (import.meta.env.DEV) console.error("Error en sendChatMessage:", error);

    // Respuestas de fallback según el tipo de error
    if (error.message.includes("503")) {
      return {
        success: false,
        response:
          "🤖 El modelo de IA se está inicializando. Por favor, espera unos segundos e intenta nuevamente.",
        error: "model_loading",
      };
    }

    if (error.message.includes("401")) {
      return {
        success: false,
        response:
          "🔑 Hay un problema con la configuración del chatbot. Estamos trabajando en solucionarlo.",
        error: "auth_error",
      };
    }

    if (error.message.includes("API key no configurada")) {
      return {
        success: false,
        response:
          "⚙️ El chatbot inteligente está en configuración. Mientras tanto, puedes contactarnos en soporte@redtickets.com",
        error: "config_error",
      };
    }

    // Error genérico - respuesta amigable
    return {
      success: false,
      response:
        "🤖 Disculpa, tengo dificultades para responder en este momento. ¿Podrías intentar reformular tu pregunta o contactarnos en soporte@redtickets.com?",
      error: "general_error",
    };
  }
};

// Función para obtener respuestas de fallback inteligentes
export const getFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  // Respuestas contextual según palabras clave
  if (
    message.includes("evento") ||
    message.includes("concierto") ||
    message.includes("show")
  ) {
    return "🎵 En RedTickets encontrarás los mejores eventos: conciertos, teatro, deportes y más. ¿Buscas algún tipo de evento en particular?";
  }

  if (
    message.includes("entrada") ||
    message.includes("ticket") ||
    message.includes("comprar")
  ) {
    return "🎫 Para comprar entradas, visita redtickets.com donde podrás ver todos los eventos disponibles y proceder con la compra segura.";
  }

  if (
    message.includes("precio") ||
    message.includes("costo") ||
    message.includes("cuanto")
  ) {
    return "💰 Los precios varían según el evento. En nuestra plataforma verás todas las opciones de entradas disponibles con sus precios actualizados.";
  }

  if (
    message.includes("ayuda") ||
    message.includes("soporte") ||
    message.includes("contacto")
  ) {
    return "🆘 Estoy aquí para ayudarte con información sobre eventos y RedTickets. También puedes contactarnos en soporte@redtickets.com o +54 11 1234-5678.";
  }

  if (
    message.includes("hola") ||
    message.includes("saludar") ||
    message.includes("buenos")
  ) {
    return "👋 ¡Hola! Soy el asistente de RedTickets. Estoy aquí para ayudarte con información sobre eventos, entradas y nuestros servicios. ¿En qué puedo asistirte?";
  }

  // Respuesta genérica amigable
  return "🤖 Gracias por tu mensaje. Como asistente de RedTickets, puedo ayudarte con información sobre eventos, entradas y nuestros servicios. ¿Hay algo específico que te interese saber?";
};
