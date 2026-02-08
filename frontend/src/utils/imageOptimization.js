/**
 * Optimización automática de imágenes de Cloudinary
 * Agrega transformaciones para mejor rendimiento en tablets y móviles
 */

/**
 * Optimiza URLs de Cloudinary agregando transformaciones automáticas
 * @param {string} url - URL original de la imagen
 * @param {Object} options - Opciones de optimización
 * @returns {string} - URL optimizada
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return '';
  
  // Verificar si es una URL de Cloudinary
  const isCloudinary = url.includes('res.cloudinary.com');
  
  if (!isCloudinary) {
    return url; // Devolver URL sin cambios si no es Cloudinary
  }
  
  // Verificar si ya tiene transformaciones
  if (url.includes('q_auto') || url.includes('f_auto')) {
    return url; // Ya está optimizada
  }
  
  // Opciones por defecto
  const {
    quality = 'auto',        // q_auto - Calidad automática según el formato
    format = 'auto',         // f_auto - Formato automático (WebP en navegadores compatibles)
    width = null,            // w_X - Ancho específico
    height = null,           // h_X - Alto específico
    crop = null,             // c_X - Modo de recorte (fill, fit, scale, etc.)
    dpr = 'auto',            // dpr_auto - Pixel ratio para pantallas Retina
  } = options;
  
  // Construir string de transformaciones
  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    dpr && `dpr_${dpr}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
  ].filter(Boolean).join(',');
  
  // Insertar transformaciones en la URL de Cloudinary
  // Formato: https://res.cloudinary.com/[cloud]/image/upload/[transformations]/[path]
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }
  
  return url; // Devolver original si no se puede parsear
}

/**
 * Optimiza una URL de imagen según el tipo de uso
 * @param {string|Object} imageObj - URL string u objeto con propiedad url
 * @param {string} type - Tipo de imagen: 'thumbnail', 'card', 'hero', 'logo'
 * @returns {string} - URL optimizada
 */
export function getOptimizedImageUrl(imageObj, type = 'default') {
  let url = '';
  
  // Extraer URL del objeto
  if (!imageObj) return '';
  if (typeof imageObj === 'string') {
    url = imageObj;
  } else if (imageObj.url) {
    url = imageObj.url;
  }
  
  if (!url) return '';
  
  // Configuraciones según el tipo de imagen
  const configs = {
    thumbnail: { width: 400, height: 400, crop: 'fill' },
    card: { width: 800, height: 600, crop: 'fill' },
    hero: { width: 1920, height: 1080, crop: 'fill' },
    logo: { width: 500 },
    profile: { width: 300, height: 300, crop: 'fill' },
    gallery: { width: 1400 }, // Solo ancho máximo, mantiene aspect ratio original
    default: {}, // Solo q_auto,f_auto,dpr_auto
  };
  
  return optimizeCloudinaryUrl(url, configs[type] || configs.default);
}

/**
 * Optimiza URL responsive según el tamaño de la pantalla
 * @param {string} url - URL de la imagen
 * @returns {string} - URL optimizada según viewport
 */
export function getResponsiveImageUrl(url) {
  if (!url) return '';
  
  const screenWidth = window.innerWidth;
  
  let width = 1920; // Desktop
  if (screenWidth <= 480) width = 480;      // Móvil
  else if (screenWidth <= 768) width = 768; // Tablet pequeña
  else if (screenWidth <= 1024) width = 1024; // Tablet
  else if (screenWidth <= 1440) width = 1440; // Laptop
  
  return optimizeCloudinaryUrl(url, { width });
}
