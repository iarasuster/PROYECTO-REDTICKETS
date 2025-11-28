import { useEffect, useState } from "react";
import { SERVER_URL } from "../services/api";
import "./LogoCarousel.css";

/**
 * LogoCarousel - Animación infinita de logos
 * Inspirado en: https://reactbits.dev/animations/logo-loop
 *
 * Los logos SVG se convierten automáticamente a blanco con CSS filter
 */
const LogoCarousel = ({ logos = [], speed = 30 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🎠 LogoCarousel montado con logos:", logos);
  }, []);

  // Si no hay logos, no renderizar nada
  if (!logos || logos.length === 0) {
    console.log("⚠️ LogoCarousel: No hay logos para mostrar");
    return null;
  }

  // Función para obtener la URL completa de la imagen
  const getImageUrl = (logo) => {
    if (!logo.imagen) return null;

    // Si imagen es un objeto con url
    if (typeof logo.imagen === "object" && logo.imagen.url) {
      const url = logo.imagen.url;
      // Si la URL ya incluye http, usarla directamente
      if (url.startsWith("http")) {
        return url;
      }
      // Si es una ruta relativa, usar SERVER_URL
      return `${SERVER_URL}${url}`;
    }

    // Si imagen es un string directo
    if (typeof logo.imagen === "string") {
      return logo.imagen.startsWith("http")
        ? logo.imagen
        : `${SERVER_URL}${logo.imagen}`;
    }

    return null;
  };

  // Duplicar los logos para crear el efecto infinito
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="logo-carousel">
      <div
        className="logo-carousel__track"
        style={{
          "--logo-count": logos.length,
          "--animation-duration": `${speed}s`,
        }}
      >
        {duplicatedLogos.map((logo, index) => {
          const imageUrl = getImageUrl(logo);
          console.log(`🖼️ Logo ${index}:`, logo.nombre, "URL:", imageUrl);

          return (
            <div
              key={`${logo.nombre || "logo"}-${index}`}
              className="logo-carousel__item"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={logo.nombre || "Logo"}
                  className="logo-carousel__image"
                  loading="lazy"
                  onError={(e) => {
                    console.error("❌ Error cargando imagen:", imageUrl);
                    e.target.style.display = "none";
                  }}
                  onLoad={() => console.log("✅ Imagen cargada:", imageUrl)}
                />
              ) : (
                <div className="logo-carousel__placeholder">
                  {logo.nombre || "Logo"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogoCarousel;
