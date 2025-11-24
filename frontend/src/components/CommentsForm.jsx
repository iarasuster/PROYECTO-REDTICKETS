import { useState } from "react";
import "./CommentsForm.css";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://redtickets-backend.onrender.com/api";

const CommentsForm = ({ onCommentSubmitted }) => {
  const [formData, setFormData] = useState({
    author: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.author.trim() || !formData.comment.trim()) {
      setMessage({
        type: "error",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    if (formData.comment.length > 1000) {
      setMessage({
        type: "error",
        text: "El comentario no puede superar los 1000 caracteres",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.doc) {
        const status = result.doc.status;

        if (status === "publicado") {
          setMessage({
            type: "success",
            text: "¡Gracias por tu testimonio! Ya está publicado. 🎉",
          });
          // Notificar al padre para recargar comentarios
          if (onCommentSubmitted) {
            onCommentSubmitted(result.doc);
          }
        } else if (status === "pendiente") {
          setMessage({
            type: "warning",
            text: "Tu testimonio está en revisión. Lo publicaremos pronto. ⏳",
          });
        }

        // Limpiar formulario
        setFormData({
          author: "",
          comment: "",
        });
      } else {
        throw new Error(
          result.errors?.[0]?.message || "Error al enviar comentario"
        );
      }
    } catch (error) {
      console.error("❌ Error al enviar comentario:", error);
      setMessage({
        type: "error",
        text: "Hubo un error al enviar tu comentario. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-form-wrapper">
      <div className="comments-form-header">
        <h3>Compartí tu experiencia</h3>
        <p className="comments-form-subtitle">
          Tu testimonio inspira a otros y nos ayuda a mejorar cada día.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="comments-form">
        <div className="form-group">
          <label htmlFor="author">Tu nombre</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            maxLength={100}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Tu testimonio</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Contanos tu experiencia con RedTickets..."
            rows={5}
            maxLength={1000}
            disabled={loading}
            required
          />
          <span className="char-counter">
            {formData.comment.length} / 1000 caracteres
          </span>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Enviando...
            </>
          ) : (
            "Enviar testimonio"
          )}
        </button>

        {message && (
          <div className={`form-message ${message.type}`}>{message.text}</div>
        )}
      </form>
    </div>
  );
};

export default CommentsForm;
