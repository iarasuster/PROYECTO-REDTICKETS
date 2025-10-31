import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";
import "./BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data.docs || []);
    } catch (err) {
      setError("Error al cargar los posts: " + err.message);
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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando las últimas noticias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Lo sentimos, hubo un problema al cargar las noticias.</p>
        <p>{error}</p>
        <button onClick={fetchPosts} className="retry-btn">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <h1>Noticias RedTickets</h1>
      <p className="blog-subtitle">
        Mantente al día con las últimas noticias del mundo del entretenimiento,
        eventos especiales y novedades de RedTickets.
      </p>
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>Próximamente tendremos noticias emocionantes para ti.</p>
          <p>
            ¡Mantente atento a las últimas novedades de eventos y
            entretenimiento!
          </p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              {post.imagenDestacada && (
                <div className="post-image">
                  <img
                    src={post.imagenDestacada.url}
                    alt={post.titulo}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="post-content">
                <h2>{post.titulo}</h2>
                <div className="post-meta">
                  <span className="author">Por {post.autor}</span>
                  <span className="date">{formatDate(post.fecha)}</span>
                </div>
                {post.extracto && (
                  <p className="post-excerpt">{post.extracto}</p>
                )}
                <a href={`/post/${post.slug}`} className="read-more">
                  Leer más →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
