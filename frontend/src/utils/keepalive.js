/**
 * Keep-alive para mantener el backend de Render despierto
 * Render Free Tier duerme servicios después de 15 min inactividad
 */

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://redtickets-backend.onrender.com";

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutos

let pingInterval = null;

/**
 * Hace ping al backend para mantenerlo despierto
 */
async function pingBackend() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/contenido-blog?limit=1`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5s timeout
    });
  } catch (error) {
    // Silent fail
  }
}

/**
 * Inicia el keep-alive automático
 */
export function startKeepAlive() {
  // Solo en producción
  if (import.meta.env.MODE !== "production") {
    return;
  }

  // Ping inicial inmediato
  pingBackend();

  // Ping cada 10 minutos
  pingInterval = setInterval(pingBackend, PING_INTERVAL);
}

/**
 * Detiene el keep-alive
 */
export function stopKeepAlive() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}
