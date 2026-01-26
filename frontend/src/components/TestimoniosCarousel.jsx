import "./TestimoniosCarousel.css";

const TestimoniosCarousel = ({ testimonios = [], loading = false }) => {
  if (loading) {
    return (
      <div className="testimonios-grid">
        <div className="testimonios-loading">
          <div className="skeleton skeleton-testimonial"></div>
          <div className="skeleton skeleton-testimonial"></div>
          <div className="skeleton skeleton-testimonial"></div>
        </div>
      </div>
    );
  }

  if (testimonios.length === 0) {
    return null;
  }

  // Dividir testimonios en dos filas
  const midpoint = Math.ceil(testimonios.length / 2);
  const firstRow = testimonios.slice(0, midpoint);
  const secondRow = testimonios.slice(midpoint);

  // Duplicar para scroll infinito
  const duplicatedFirstRow = [...firstRow, ...firstRow, ...firstRow];
  const duplicatedSecondRow = [...secondRow, ...secondRow, ...secondRow];

  const renderTestimonial = (testimonio, index) => (
    <div
      key={`${testimonio.tipo}-${index}`}
      className="testimonial-card-wrapper"
    >
      <div className="testimonial-card">
        <div className="quote-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </div>
        <p className="testimonial-text">{testimonio.texto}</p>
        <div className="testimonial-author">
          <div className="author-avatar">
            {testimonio.autor.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <p className="author-name">{testimonio.autor}</p>
            {testimonio.fecha && (
              <p className="author-date">
                {new Date(testimonio.fecha).toLocaleDateString(
                  "es-UY",
                  {
                    year: "numeric",
                    month: "long",
                  }
                )}
              </p>
            )}
            {testimonio.tipo === "estatico" && (
              <p className="author-date">Cliente verificado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="testimonios-grid">
      {/* Primera fila - scroll hacia la izquierda */}
      <div 
        className="testimonios-track"
        style={{
          "--animation-duration": "40s"
        }}
      >
        {duplicatedFirstRow.map(renderTestimonial)}
      </div>

      {/* Segunda fila - scroll hacia la derecha */}
      <div 
        className="testimonios-track testimonios-track-reverse"
        style={{
          "--animation-duration": "40s"
        }}
      >
        {duplicatedSecondRow.map(renderTestimonial)}
      </div>
    </div>
  );
};

export default TestimoniosCarousel;
