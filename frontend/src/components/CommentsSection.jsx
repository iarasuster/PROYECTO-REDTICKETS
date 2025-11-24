import { useState } from "react";
import CommentsForm from "./CommentsForm";
import CommentsList from "./CommentsList";
import "./CommentsSection.css";

const CommentsSection = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentSubmitted = (newComment) => {
    console.log("✅ Nuevo comentario enviado:", newComment);

    // Si el comentario fue publicado automáticamente, recargar la lista
    if (newComment.status === "publicado") {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-container">
        {/* Formulario para enviar comentarios */}
        <CommentsForm onCommentSubmitted={handleCommentSubmitted} />

        {/* Divisor visual */}
        <div className="comments-divider"></div>

        {/* Lista de comentarios publicados */}
        <CommentsList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default CommentsSection;
