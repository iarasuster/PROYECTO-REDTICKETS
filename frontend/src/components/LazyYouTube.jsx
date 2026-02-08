import { useState } from 'react';
import './LazyYouTube.css';

/**
 * Componente de YouTube con carga diferida
 * Solo carga el iframe cuando el usuario hace click
 * Ahorra ~777 KiB de JavaScript de YouTube
 */
const LazyYouTube = ({ videoId, title = "Video de YouTube" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setIsLoaded(true);
  };

  if (isLoaded) {
    return (
      <div className="lazy-youtube-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="lazy-youtube-iframe"
        />
      </div>
    );
  }

  // Thumbnail de YouTube en máxima calidad (1280x720)
  // Fallback a sddefault si maxres no está disponible
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;

  return (
    <div className="lazy-youtube-container" onClick={handleClick}>
      <img
        src={thumbnailUrl}
        alt={title}
        className="lazy-youtube-thumbnail"
        loading="lazy"
        onError={(e) => {
          // Si maxres no existe, usar sddefault
          if (e.target.src !== fallbackUrl) {
            e.target.src = fallbackUrl;
          }
        }}
      />
      <button className="lazy-youtube-play-button" aria-label="Reproducir video">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path
            d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
            fill="#f00"
          />
          <path d="M 45,24 27,14 27,34" fill="#fff" />
        </svg>
      </button>
    </div>
  );
};

export default LazyYouTube;
