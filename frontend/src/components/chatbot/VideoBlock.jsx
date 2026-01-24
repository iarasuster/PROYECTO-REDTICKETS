/**
 * VideoBlock Component
 *
 * Renders an embedded video (YouTube or local)
 *
 * IMPORTANT: Only one video exists in the system:
 * - Tutorial: "Cómo comprar entradas"
 * - URL: https://www.youtube.com/embed/SfHuVUmpzgU
 */

import React from "react";
import "./VisualBlocks.css";

export function VideoBlock({ src, title }) {
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
