import { useState } from "react";
import { SERVER_URL } from "../services/api";
import "./BentoGrid.css";

const BentoGrid = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) return null;

  const getImageUrl = (photo) => {
    if (!photo.imagen) return "";

    // Si imagen es un objeto con url
    if (typeof photo.imagen === "object" && photo.imagen.url) {
      const url = photo.imagen.url;
      // Si la URL ya incluye http, usarla directamente
      if (url.startsWith("http")) {
        return url;
      }
      // Si es una ruta relativa, usar SERVER_URL
      return `${SERVER_URL}${url}`;
    }

    // Si imagen es un string directo
    if (typeof photo.imagen === "string") {
      return photo.imagen.startsWith("http")
        ? photo.imagen
        : `${SERVER_URL}${photo.imagen}`;
    }

    return "";
  };

  return (
    <>
      <div className="bento-grid-container">
        <div className="bento-grid">
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
