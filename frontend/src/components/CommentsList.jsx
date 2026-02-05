import { useState, useEffect } from "react";
import "./CommentsList.css";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
      : "https://redtickets-backend.vercel.app/api";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch solo comentarios publicados, ordenados por fecha descendente
      const response = await fetch(
        `${API_BASE_URL}/comments?where[status][equals]=publicado&sort=-createdAt&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar comentarios");
      }

      const result = await response.json();

      if (result.docs) {
        setComments(result.docs);
      }
    } catch (err) {
      if (import.meta.env.DEV)
        console.error("❌ Error fetching comments:", err);
      setError("No se pudieron cargar los comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [refreshTrigger]); // Recargar cuando cambie refreshTrigger

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60)
      return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;

    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="comments-list-loading">
        <div className="spinner-large"></div>
        <p>Cargando comentarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comments-list-error">
        <p>{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="comments-list-empty">
        <p>
          Todavía no hay testimonios. ¡Sé el primero en compartir tu
          experiencia!
        </p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      <h4 className="comments-list-title">
        Testimonios de la comunidad ({comments.length})
      </h4>

      <div className="comments-grid">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <div className="comment-avatar">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div className="comment-meta">
                <h5 className="comment-author">{comment.author}</h5>
                <span className="comment-date">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>

            <p className="comment-text">{comment.comment}</p>

            {comment.eventRef && (
              <div className="comment-event-ref">
                📅 Relacionado con: {comment.eventRef}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
