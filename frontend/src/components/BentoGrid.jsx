import { useState } from "react";
import "./BentoGrid.css";

const BentoGrid = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) return null;

  const getImageUrl = (photo) => {
    if (!photo.imagen) return "";

    if (photo.imagen.url && photo.imagen.url.startsWith("http")) {
      return photo.imagen.url;
    }
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
