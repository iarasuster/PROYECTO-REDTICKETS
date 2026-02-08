import { useState, useRef, useEffect } from "react";
import { SERVER_URL } from "../services/api";
import { getOptimizedImageUrl } from "../utils/imageOptimization";
import "./BentoGrid.css";

const BentoGrid = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const gridRef = useRef(null);

  if (!photos || photos.length === 0) return null;

  const getImageUrl = (photo) => {
    if (!photo.imagen) return "";

    let url = '';
    // Si imagen es un objeto con url
    if (typeof photo.imagen === "object" && photo.imagen.url) {
      url = photo.imagen.url;
      // Si es una ruta relativa, usar SERVER_URL
      if (!url.startsWith("http")) {
        url = `${SERVER_URL}${url}`;
      }
    }
    // Si imagen es un string directo
    else if (typeof photo.imagen === "string") {
      url = photo.imagen.startsWith("http")
        ? photo.imagen
        : `${SERVER_URL}${photo.imagen}`;
    }

    if (!url) return "";
    
    // Optimizar para galería
    return getOptimizedImageUrl(url, 'gallery');
  };

  // Convertir scroll vertical a horizontal
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleWheel = (e) => {
      // Solo si hay contenido para scrollear horizontalmente
      if (grid.scrollWidth > grid.clientWidth) {
        e.preventDefault();
        grid.scrollLeft += e.deltaY;
      }
    };

    // Navegación con teclado (flechas)
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        grid.scrollBy({ left: -300, behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        grid.scrollBy({ left: 300, behavior: "smooth" });
      }
    };

    grid.addEventListener("wheel", handleWheel, { passive: false });
    grid.addEventListener("keydown", handleKeyDown);

    return () => {
      grid.removeEventListener("wheel", handleWheel);
      grid.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="bento-grid-container">
        <div
          className="bento-grid"
          ref={gridRef}
          tabIndex="0"
          role="region"
          aria-label="Galería de fotos de eventos"
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`bento-item bento-${photo.orientacion || "horizontal"}`}
            >
              <div className="bento-image-wrapper">
                <img
                  src={getImageUrl(photo)}
                  alt={photo.titulo || `Evento ${index + 1}`}
                  loading="lazy"
                  className="bento-image"
                />
                <div className="bento-overlay">
                  {photo.titulo && (
                    <span className="bento-title">{photo.titulo}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BentoGrid;
