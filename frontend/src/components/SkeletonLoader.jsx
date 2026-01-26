import "./SkeletonLoader.css";
const SkeletonLoader = ({ variant = "default" }) => {
  if (variant === "hero") {
    return (
      <div className="skeleton-hero">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div className="skeleton-stats">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-stat-item">
            <div className="skeleton skeleton-number"></div>
            <div className="skeleton skeleton-label"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="skeleton-cards">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-card-image"></div>
            <div className="skeleton-card-content">
              <div className="skeleton skeleton-card-title"></div>
              <div className="skeleton skeleton-card-text"></div>
              <div className="skeleton skeleton-card-text short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="skeleton-list">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-list-item">
            <div className="skeleton skeleton-list-title"></div>
            <div className="skeleton skeleton-list-text"></div>
            <div className="skeleton skeleton-list-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default: contenido general
  return (
    <div className="skeleton-content">
      <div className="skeleton skeleton-heading"></div>
      <div className="skeleton skeleton-text-line"></div>
      <div className="skeleton skeleton-text-line"></div>
      <div className="skeleton skeleton-text-line short"></div>
    </div>
  );
};

export default SkeletonLoader;
