/**
 * VideoBlock Component
 *
 * Renders an embedded video (YouTube or local) with lazy loading
 *
 * IMPORTANT: Only one video exists in the system:
 * - Tutorial: "Cómo comprar entradas"
 * - URL: https://www.youtube.com/embed/O_JRfiGeSNI
 */

import React from "react";
import LazyYouTube from "../LazyYouTube";
import "./VisualBlocks.css";

export function VideoBlock({ src, title }) {
  // Extraer videoId de URL de YouTube
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(src);

  if (videoId) {
    // Usar LazyYouTube para videos de YouTube
    return (
      <div className="visual-block video-block">
        {title && <h4 className="video-title">{title}</h4>}
        <div className="video-container">
          <LazyYouTube videoId={videoId} title={title || "Video"} />
        </div>
      </div>
    );
  }

  // Fallback para videos locales o de otras fuentes
  return (
    <div className="visual-block video-block">
      {title && <h4 className="video-title">{title}</h4>}
      <div className="video-container">
        <iframe
          src={src}
          title={title || "Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video-iframe"
        />
      </div>
    </div>
  );
}
