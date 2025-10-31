import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug } from "../services/api";
import "./BlogPost.css";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.titulo} | RedTickets Blog`;
    } else {
      document.title = "RedTickets Blog";
    }

    // Cleanup: restaurar título original al desmontar
    return () => {
      document.title = "RedTickets Blog";
    };
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPostBySlug(slug);
      setPost(data.docs[0] || null);
    } catch (err) {
      setError("Error al cargar el post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = (content) => {
    // Función simple para renderizar contenido rico
    // En una implementación real, necesitarías un parser más sofisticado
    if (typeof content === "string") {
      return content;
    }

    // Para contenido de Lexical/RichText, renderizamos de forma básica
    if (content?.root?.children) {
      return content.root.children.map((child, index) => {
        if (child.type === "paragraph") {
          return (
            <p key={index}>
              {child.children?.map((textNode, textIndex) => (
                <span key={textIndex}>{textNode.text}</span>
              ))}
            </p>
          );
        }
        return null;
      });
    }

    return content;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <Link to="/" className="back-link">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="not-found">
        <h1>Post no encontrado</h1>
        <p>El post que buscas no existe o ha sido eliminado.</p>
        <Link to="/" className="back-link">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <article className="blog-post">
      <div className="post-header">
        <Link to="/" className="back-link">
          ← Volver a Noticias
        </Link>
        <h1>{post.titulo}</h1>
        <div className="post-meta">
          <span className="author">Por {post.autor}</span>
          <span className="date">{formatDate(post.fecha)}</span>
        </div>
      </div>

      {post.imagenDestacada && (
        <div className="post-featured-image">
          <img src={post.imagenDestacada.url} alt={post.titulo} />
        </div>
      )}

      <div className="post-content">{renderContent(post.contenido)}</div>

      <div className="post-footer">
        <Link to="/" className="back-to-blog">
          ← Volver a Noticias
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;
