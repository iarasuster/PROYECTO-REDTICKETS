/**
 * CardList Component
 *
 * Renders a list of cards for services, options, or features
 * Cards can have actions for navigation or interaction
 */

import React from "react";
import { Link } from "react-router-dom";
import "./VisualBlocks.css";

export function CardList({ items, onAction }) {
  const handleCardClick = (action) => {
    if (action && onAction) {
      onAction(action);
    }
  };

  return (
    <div className="visual-block card-list">
      <div className="cards-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className={`card ${item.action ? "card-clickable" : ""}`}
            onClick={() => item.action && handleCardClick(item.action)}
          >
            {item.image && (
              <div className="card-image">
                <img src={item.image} alt={item.title} />
              </div>
            )}
            <div className="card-content">
              <h4 className="card-title">{item.title}</h4>
              {item.description && (
                <p className="card-description">{item.description}</p>
              )}
              {item.action && (
                <span className="card-action-hint">Ver más →</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
