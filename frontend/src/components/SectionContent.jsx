import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getContentBySection, SERVER_URL } from "../services/api";
import ChromaGrid from "./ChromaGrid";
import CommentsForm from "./CommentsForm";
import Counter from "./Counter";
import LogoCarousel from "./LogoCarousel";
import SkeletonLoader from "./SkeletonLoader";
import TestimoniosCarousel from "./TestimoniosCarousel";
import BentoGrid from "./BentoGrid";
import loaderAnimation from "../assets/loader.lottie";
import "./SectionContent.css";

// Helper para obtener URL correcta de imagen
const getImageUrl = (imageObj) => {
  if (!imageObj?.url) return null;
  // Si ya empieza con http, usar directamente
  if (imageObj.url.startsWith("http")) return imageObj.url;
  // Si es ruta relativa, agregar SERVER_URL
  return `${SERVER_URL}${imageObj.url}`;
};

const SectionContent = ({ seccion, className = "" }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const seccionField = seccion.replace(/-/g, "_");
        const result = await getContentBySection(seccionField);

        if (result.success && result.data) {
          setContent(result.data);
          setError(null);
        } else {
          setError("No se encontró contenido para esta sección");
        }
      } catch (err) {
        console.error("❌ Error fetching section content:", err);
        setError("Error al cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    if (seccion) {
      fetchContent();
    }
  }, [seccion]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const items = document.querySelectorAll(".content-item");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [content]);

  if (loading) {
    // Mostrar skeleton específico según la sección
    const skeletonVariant = {
      inicio: "stats",
      servicios: "cards",
      comunidad: "list",
      ayuda: "list",
      "sobre-nosotros": "default",
      contacto: "default",
    }[seccion.replace(/-/g, "_")] || "default";

    return (
      <div className="section-loading">
        <SkeletonLoader variant={skeletonVariant} />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="section-error">
        <p>{error || "No hay contenido disponible"}</p>
      </div>
    );
  }

  return (
    <div className={`section-content ${className}`}>
      {renderSectionContent(seccion, content)}
    </div>
  );
};

const renderSectionContent = (seccion, data) => {
  switch (seccion) {
    case "inicio":
      return <InicioContent data={data} />;
    case "sobre-nosotros":
      return <SobreNosotrosContent data={data} />;
    case "servicios":
      return <ServiciosContent data={data} />;
    case "comunidad":
      return <ComunidadContent data={data} />;
    case "ayuda":
      return <AyudaContent data={data} />;
    case "contacto":
      return <ContactoContent data={data} />;
    default:
      return <GenericContent data={data} />;
  }
};

// Componente para la sección INICIO
const InicioContent = ({ data }) => {
  // Hook para cargar logos de productores desde la sección "sobre_nosotros"
  const [logosProductores, setLogosProductores] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const result = await getContentBySection("sobre_nosotros");
        if (
          result.success &&
          result.data?.socios_comerciales?.productores?.logos
        ) {
          setLogosProductores(result.data.socios_comerciales.productores.logos);
        }
      } catch (err) {
        // Silently fail in production
      }
    };
    fetchLogos();
  }, []);

  return (
    <div className="inicio-content">
      {/* Carousel de Logos de Productores */}
      {logosProductores.length > 0 && (
        <div className="inicio-logos animate-item">
          <h3 className="logos-title">Confían en nosotros</h3>
          <LogoCarousel logos={logosProductores} speed={40} />
        </div>
      )}

      {/* Stats en fila */}
      {data.estadisticas && (
        <div className="inicio-stats animate-item">
          <div className="stats-row">
            {data.estadisticas.transacciones && (
              <div className="stat-item">
                <Counter
                  end={data.estadisticas.transacciones}
                  duration={2000}
                  suffix="+"
                />
                <div className="stat-label">Transacciones</div>
              </div>
            )}
            {data.estadisticas.eventos_realizados && (
              <div className="stat-item">
                <Counter
                  end={data.estadisticas.eventos_realizados}
                  duration={2000}
                  suffix="+"
                />
                <div className="stat-label">Eventos Realizados</div>
              </div>
            )}
            {data.estadisticas.productores && (
              <div className="stat-item">
                <Counter
                  end={data.estadisticas.productores}
                  duration={2000}
                  suffix="+"
                />
                <div className="stat-label">Productores</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview de Secciones */}
      <div className="sections-preview animate-item">
        <h2 className="preview-title">Descubre RedTickets</h2>

        <div className="preview-list">
          {/* Sobre Nosotros */}
          <a href="/seccion/sobre-nosotros" className="preview-item">
            <div className="preview-header">
              <h3>Sobre Nosotros</h3>
              <span className="preview-arrow">→</span>
            </div>
            <p>
              Más de 10 años conectando personas con experiencias únicas. Conoce
              nuestro equipo, nuestra historia y la pasión que nos impulsa día a
              día.
            </p>
          </a>

          {/* Servicios */}
          <a href="/seccion/servicios" className="preview-item">
            <div className="preview-header">
              <h3>Servicios</h3>
              <span className="preview-arrow">→</span>
            </div>
            <p>
              Venta de entradas, control de acceso, hard ticketing, streaming y
              más. Soluciones completas e integrales para tu evento.
            </p>
          </a>

          {/* Comunidad */}
          <a href="/seccion/comunidad" className="preview-item">
            <div className="preview-header">
              <h3>Comunidad</h3>
              <span className="preview-arrow">→</span>
            </div>
            <p>
              Lee testimonios de productores y asistentes que confían en
              RedTickets para crear experiencias inolvidables.
            </p>
          </a>

          {/* Ayuda */}
          <a href="/seccion/ayuda" className="preview-item">
            <div className="preview-header">
              <h3>Centro de Ayuda</h3>
              <span className="preview-arrow">→</span>
            </div>
            <p>
              ¿Dudas sobre cómo comprar o vender entradas? Encuentra respuestas
              a las preguntas más frecuentes y soporte personalizado.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

const SobreNosotrosContent = ({ data }) => {
  const [activeFounder, setActiveFounder] = useState(null);

  return (
    <div className="sobre-nosotros-container">
      {/* FILA 1: Fundadores - Foto Grupal con Tooltips */}
      {data.fundadores_foto?.url && (
        <div className="sobre-row fundadores-row">
          <h3 className="section-title">Fundadores</h3>

          <div className="fundadores-photo-interactive">
            <img
              src={getImageUrl(data.fundadores_foto)}
              alt="Fundadores de RedTickets"
              className="group-photo"
              loading="lazy"
            />

            {/* Áreas interactivas sobre cada fundador */}
            {data.fundadores && data.fundadores.length === 4 && (
              <div className="fundadores-hotspots">
                {data.fundadores.map((fundador, idx) => (
                  <div
                    key={idx}
                    className={`fundador-hotspot hotspot-${idx + 1} ${
                      activeFounder === idx ? "active" : ""
                    }`}
                    onClick={() =>
                      setActiveFounder(activeFounder === idx ? null : idx)
                    }
                  >
                    <div className="fundador-star-icon">
                      <img
                        src="/ISOTIPO.svg"
                        alt="Ver info"
                        className="isotipo-icon"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tooltips debajo de la foto */}
          {data.fundadores && data.fundadores.length === 4 && (
            <div className="fundadores-info-below">
              {data.fundadores.map(
                (fundador, idx) =>
                  activeFounder === idx && (
                    <div key={idx} className="fundador-info-card">
                      <strong>{fundador.nombre}</strong>
                      <span>{fundador.cargo}</span>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      )}

      {/* FILA 2: Equipo */}
      {data.equipo && data.equipo.length > 0 && (
        <div className="sobre-row equipo-row">
          <h3 className="section-title">Nuestro Equipo</h3>
          <div className="team-grid">
            {data.equipo.map((miembro, idx) => {
              return (
                <ChromaGrid
                  key={idx}
                  colors={["#ff6600", "#ff8833", "#ff9944"]}
                  intensity={0.3}
                >
                  <div className="team-member">
                    {miembro.imagen?.url ? (
                      <div className="team-photo">
                        <img
                          src={getImageUrl(miembro.imagen)}
                          alt={miembro.nombre}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="team-photo placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <h4>{miembro.nombre}</h4>
                    <p className="team-role">{miembro.area}</p>
                  </div>
                </ChromaGrid>
              );
            })}
          </div>
        </div>
      )}

      {/* FILA 3: Socios Comerciales - Título General */}
      {data.socios_comerciales && (
        <div className="sobre-row socios-header-row">
          <h3 className="section-title">Socios Comerciales</h3>
          {data.socios_comerciales.descripcion && (
            <p className="socios-intro">
              {data.socios_comerciales.descripcion}
            </p>
          )}
        </div>
      )}

      {/* FILA 4: Productores */}
      {data.socios_comerciales?.productores && (
        <div className="sobre-row socios-category-row">
          <h4 className="socios-category-title">
            {data.socios_comerciales.productores.titulo || "Amigos Productores"}
          </h4>
          {data.socios_comerciales.productores.descripcion && (
            <p className="category-desc">
              {data.socios_comerciales.productores.descripcion}
            </p>
          )}
          {data.socios_comerciales.productores.logos &&
            data.socios_comerciales.productores.logos.length > 0 && (
              <LogoCarousel
                logos={data.socios_comerciales.productores.logos}
                speed={35}
              />
            )}
        </div>
      )}

      {/* FILA 5: Partners Publicitarios */}
      {data.socios_comerciales?.partners_publicitarios && (
        <div className="sobre-row socios-category-row">
          <h4 className="socios-category-title">
            {data.socios_comerciales.partners_publicitarios.titulo ||
              "Partners Publicitarios"}
          </h4>
          {data.socios_comerciales.partners_publicitarios.descripcion && (
            <p className="category-desc">
              {data.socios_comerciales.partners_publicitarios.descripcion}
            </p>
          )}
          {data.socios_comerciales.partners_publicitarios.logos &&
            data.socios_comerciales.partners_publicitarios.logos.length > 0 && (
              <LogoCarousel
                logos={data.socios_comerciales.partners_publicitarios.logos}
                speed={45}
              />
            )}
        </div>
      )}
    </div>
  );
};

const ServiciosContent = ({ data }) => {
  // Mapeo de servicios a iconos y colores específicos
  const getServiceDetails = (servicio) => {
    const texto = (servicio.servicio || servicio || "").toLowerCase();

    if (texto.includes("venta") || texto.includes("gestión"))
      return { icon: "fa-shopping-cart", color: "#ff6600", gradient: "linear-gradient(135deg, #ff6600 0%, #ff8833 100%)" };
    if (texto.includes("compra") || texto.includes("pago"))
      return { icon: "fa-credit-card", color: "#00d4ff", gradient: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)" };
    if (texto.includes("app") || texto.includes("billetera"))
      return { icon: "fa-mobile-alt", color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)" };
    if (
      texto.includes("diseño") ||
      texto.includes("e-ticket") ||
      texto.includes("personalizado")
    )
      return { icon: "fa-palette", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" };
    if (
      texto.includes("hard") ||
      texto.includes("impresión") ||
      texto.includes("físicas")
    )
      return { icon: "fa-print", color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" };
    if (
      texto.includes("control") ||
      texto.includes("acceso") ||
      texto.includes("seguridad")
    )
      return { icon: "fa-shield-alt", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" };
    if (
      texto.includes("configuración") ||
      texto.includes("descuento") ||
      texto.includes("promoción")
    )
      return { icon: "fa-cog", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" };
    if (texto.includes("integración") || texto.includes("sistema"))
      return { icon: "fa-plug", color: "#14b8a6", gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" };
    if (
      texto.includes("atención") ||
      texto.includes("cliente") ||
      texto.includes("soporte")
    )
      return { icon: "fa-headset", color: "#f43f5e", gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" };
    if (texto.includes("seguro") || texto.includes("metlife"))
      return { icon: "fa-umbrella", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" };
    if (texto.includes("acreditaciones") || texto.includes("credenciales"))
      return { icon: "fa-id-card", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" };

    return { icon: "fa-ticket-alt", color: "#ff6600", gradient: "linear-gradient(135deg, #ff6600 0%, #ff8833 100%)" };
  };

  return (
    <div className="servicios-container">
      {/* Hero Section */}
      <div className="servicios-hero">
        <div className="servicios-hero-content">
          <span className="servicios-badge">Plataforma Integral</span>
          <h1 className="servicios-hero-title">
            Soluciones completas para
            <span className="servicios-hero-highlight"> tu evento</span>
          </h1>
          <p className="servicios-hero-description">
            En RedTickets ofrecemos una plataforma integral de ticketing que abarca
            todo el ciclo del evento: desde la venta online hasta el control de acceso.
            Nuestra tecnología permite gestionar entradas físicas y digitales, con
            seguridad, personalización y soporte profesional para eventos de cualquier tamaño.
          </p>
        </div>
      </div>

      {/* Grid de servicios profesional */}
      {data.servicios_lista && data.servicios_lista.length > 0 && (
        <div className="servicios-grid">
          {data.servicios_lista.map((item, idx) => {
            const details = getServiceDetails(item);
            return (
              <div key={idx} className="servicio-card" data-index={idx}>
                <div className="servicio-card-inner">
                  <div className="servicio-icon-wrapper" style={{ '--icon-gradient': details.gradient }}>
                    <i className={`fas ${details.icon} servicio-card-icon`}></i>
                  </div>
                  <div className="servicio-card-content">
                    <p className="servicio-card-text">{item.servicio || item}</p>
                  </div>
                  <div className="servicio-card-glow" style={{ '--glow-color': details.color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ComunidadContent = ({ data }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentSubmitted = (newComment) => {
    // Si el comentario fue publicado automáticamente, recargar la lista
    if (newComment.status === "publicado") {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="comunidad-container">
      {/* Bento Grid - Galería de Fotos */}
      {data.galeria_fotos && data.galeria_fotos.length > 0 && (
        <BentoGrid photos={data.galeria_fotos} />
      )}

      {/* Titulo principal */}
      <div className="comunidad-header">
        <h2 className="comunidad-title">Lo que dicen nuestros clientes</h2>
        <p className="comunidad-subtitle">
          Miles de personas confían en RedTickets para sus eventos
        </p>
      </div>

      {/* Carrusel de Testimonios */}
      <div className="testimonios-section">
        <TestimoniosUnified
          staticTestimonios={data.testimonios || []}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Formulario mejorado */}
      <div className="comunidad-form-section">
        <div className="form-header">
          <h3>Comparte tu experiencia</h3>
          <p>Tu opinión nos ayuda a mejorar cada día</p>
        </div>
        <CommentsForm onCommentSubmitted={handleCommentSubmitted} />
      </div>
    </div>
  );
};

// Componente unificado que combina testimonios estáticos y dinámicos
const TestimoniosUnified = ({ staticTestimonios, refreshTrigger }) => {
  const [dynamicTestimonios, setDynamicTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://redtickets-backend.onrender.com/api";

  useEffect(() => {
    const fetchDynamicTestimonios = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/comments?where[status][equals]=publicado&sort=-createdAt&limit=50`,
        );

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Testimonios cargados:", result.docs?.length || 0);
          if (result.docs) {
            setDynamicTestimonios(result.docs);
          }
        } else {
          console.error("❌ Error HTTP:", response.status);
        }
      } catch (err) {
        console.error("❌ Error fetching testimonios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicTestimonios();
  }, [refreshTrigger, API_BASE_URL]);

  // Combinar testimonios estáticos y dinámicos
  const allTestimonios = [
    ...staticTestimonios.map((t) => ({
      texto: t.texto,
      autor: t.autor,
      tipo: "estatico",
    })),
    ...dynamicTestimonios.map((t) => ({
      texto: t.comment,
      autor: t.author,
      tipo: "dinamico",
      fecha: t.createdAt,
    })),
  ];

  console.log("📊 Total testimonios:", allTestimonios.length, {
    estaticos: staticTestimonios.length,
    dinamicos: dynamicTestimonios.length,
  });

  return (
    <TestimoniosCarousel testimonios={allTestimonios} loading={loading} />
  );
};

const AyudaContent = ({ data }) => {
  const [activeTab, setActiveTab] = useState("comprar");

  // Leer el parámetro 'tab' de la URL al montar el componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");

    if (
      tabParam &&
      [
        "comprar",
        "vender",
        "datos",
        "politicas",
        "devoluciones",
        "tecnica",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  const tabs = [
    { id: "comprar", label: "Cómo Comprar" },
    { id: "vender", label: "Cómo Vender" },
    { id: "datos", label: "Datos Importantes" },
    { id: "politicas", label: "Políticas" },
    { id: "devoluciones", label: "Devoluciones" },
    { id: "tecnica", label: "Ayuda Técnica" },
  ];

  return (
    <div className="ayuda-container">
      {/* Tabs Navigation */}
      <div className="ayuda-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="ayuda-content">
        {activeTab === "comprar" && data.como_comprar && (
          <div className="tab-panel animate-in">
            <h3>Cómo Comprar</h3>
            <p className="intro-text">{data.como_comprar.introduccion}</p>
            {data.como_comprar.pasos && (
              <div className="pasos-lista">
                {data.como_comprar.pasos.map((paso, idx) => (
                  <div key={idx} className="paso-item">
                    <div className="paso-number">{idx + 1}</div>
                    <div className="paso-content">
                      <h4>{paso.titulo}</h4>
                      {paso.detalle && <p>{paso.detalle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "vender" && data.como_vender && (
          <div className="tab-panel animate-in">
            <h3>Cómo Vender</h3>
            <p className="intro-text">{data.como_vender.introduccion}</p>
            {data.como_vender.pasos && (
              <div className="pasos-lista">
                {data.como_vender.pasos.map((paso, idx) => (
                  <div key={idx} className="paso-item">
                    <div className="paso-number">{idx + 1}</div>
                    <div className="paso-content">
                      <h4>{paso.titulo}</h4>
                      <p>{paso.detalle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "datos" && data.datos_importantes && (
          <div className="tab-panel animate-in">
            <h3>Datos Importantes</h3>

            {data.datos_importantes.faqs &&
            Array.isArray(data.datos_importantes.faqs) &&
            data.datos_importantes.faqs.length > 0 ? (
              data.datos_importantes.faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h4>{faq.pregunta}</h4>
                  <div className="rich-text-content">
                    {faq.respuesta &&
                      faq.respuesta.root &&
                      faq.respuesta.root.children &&
                      faq.respuesta.root.children.map((block, blockIdx) => {
                        if (block.type === "paragraph" && block.children) {
                          return (
                            <p key={blockIdx}>
                              {block.children.map((child, childIdx) => {
                                if (child.bold) {
                                  return (
                                    <strong key={childIdx}>{child.text}</strong>
                                  );
                                }
                                return <span key={childIdx}>{child.text}</span>;
                              })}
                            </p>
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>
              ))
            ) : (
              <p>No hay datos importantes disponibles.</p>
            )}
          </div>
        )}

        {activeTab === "politicas" && data.politicas && (
          <div className="tab-panel animate-in">
            <h3>Políticas</h3>
            {data.politicas.cancelacion_eventos && (
              <div className="politica-item">
                <h4>Cancelación de Eventos</h4>
                <p>{data.politicas.cancelacion_eventos}</p>
              </div>
            )}
            {data.politicas.reprogramacion && (
              <div className="politica-item">
                <h4>Reprogramación</h4>
                <p>{data.politicas.reprogramacion}</p>
              </div>
            )}
            {data.politicas.reembolsos && (
              <div className="politica-item">
                <h4>Reembolsos</h4>
                <p>{data.politicas.reembolsos}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "devoluciones" && data.devoluciones && (
          <div className="tab-panel animate-in">
            <h3>Devoluciones</h3>
            {data.devoluciones.condiciones && (
              <div className="politica-item">
                <h4>Condiciones</h4>
                <p>{data.devoluciones.condiciones}</p>
              </div>
            )}
            {data.devoluciones.medio_devolucion && (
              <div className="politica-item">
                <h4>Medio de Devolución</h4>
                <p>{data.devoluciones.medio_devolucion}</p>
              </div>
            )}
            {data.devoluciones.tiempo_estimado && (
              <div className="politica-item">
                <h4>Tiempo Estimado</h4>
                <p>{data.devoluciones.tiempo_estimado}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tecnica" && data.ayuda_tecnica && (
          <div className="tab-panel animate-in">
            <h3>Ayuda Técnica</h3>

            {/* Uso del Tótem */}
            {data.ayuda_tecnica.uso_totem && (
              <div className="ayuda-item">
                <h4>Uso del Tótem</h4>
                <p>{data.ayuda_tecnica.uso_totem.descripcion}</p>
                {data.ayuda_tecnica.uso_totem.video && (
                  <p className="video-link">
                    <i className="fas fa-play-circle"></i>{" "}
                    {data.ayuda_tecnica.uso_totem.video}
                  </p>
                )}
              </div>
            )}

            {/* Cambio de Rollo */}
            {data.ayuda_tecnica.cambio_rollo &&
              Array.isArray(data.ayuda_tecnica.cambio_rollo) && (
                <div className="ayuda-item">
                  <h4>Cambio de Rollo</h4>
                  <ol className="instrucciones-lista">
                    {data.ayuda_tecnica.cambio_rollo.map((item, idx) => (
                      <li key={item.id || idx}>
                        {typeof item === "string" ? item : item.paso}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            {/* Cancelar Compra en Tótem */}
            {data.ayuda_tecnica.cancelar_compra_totem && (
              <div className="ayuda-item">
                <h4>Cancelar Compra en Tótem</h4>
                <p>{data.ayuda_tecnica.cancelar_compra_totem.descripcion}</p>
                {data.ayuda_tecnica.cancelar_compra_totem.campos &&
                  Array.isArray(
                    data.ayuda_tecnica.cancelar_compra_totem.campos,
                  ) && (
                    <form
                      className="ayuda-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {data.ayuda_tecnica.cancelar_compra_totem.campos.map(
                        (item, idx) => {
                          const fieldName =
                            typeof item === "string" ? item : item.campo;
                          const isTextarea = fieldName
                            .toLowerCase()
                            .includes("motivo");
                          return (
                            <div key={item.id || idx} className="form-group">
                              <label>{fieldName}</label>
                              {isTextarea ? (
                                <textarea
                                  placeholder={`Ingresa ${fieldName.toLowerCase()}`}
                                  rows="3"
                                />
                              ) : (
                                <input
                                  type="text"
                                  placeholder={`Ingresa ${fieldName.toLowerCase()}`}
                                />
                              )}
                            </div>
                          );
                        },
                      )}
                      <button type="submit" className="btn-primary">
                        Enviar Solicitud
                      </button>
                    </form>
                  )}
              </div>
            )}

            {/* Solicitar Rollos */}
            {data.ayuda_tecnica.solicitar_nuevos_rollos && (
              <div className="ayuda-item">
                <h4>Solicitar Nuevos Rollos</h4>
                <p>{data.ayuda_tecnica.solicitar_nuevos_rollos}</p>
                <form
                  className="ayuda-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-group">
                    <label>Cantidad de Rollos</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ingresa la cantidad requerida"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lugar o Evento</label>
                    <input
                      type="text"
                      placeholder="Ingresa el lugar o nombre del evento"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Solicitar Rollos
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ContactoContent = ({ data }) => (
  <div className="content-grid">
    {data.formulario && data.formulario.length > 0 && (
      <div className="content-item formulario animate-item">
        <h3>Contáctanos</h3>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          {data.formulario.map((campo, idx) => {
            const fieldName = typeof campo === "string" ? campo : campo.campo;
            const isTextarea = fieldName.toLowerCase().includes("mensaje");
            return (
              <div key={idx} className="form-group">
                <label>{fieldName}</label>
                {isTextarea ? (
                  <textarea
                    placeholder={`Ingresa tu ${fieldName.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={
                      fieldName.toLowerCase().includes("email")
                        ? "email"
                        : "text"
                    }
                    placeholder={`Ingresa tu ${fieldName.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
          <button type="submit" className="btn btn-large">
            Enviar mensaje
          </button>
        </form>
      </div>
    )}
  </div>
);

const GenericContent = ({ data }) => (
  <div className="content-grid">
    <div className="content-item texto animate-item">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  </div>
);

export default SectionContent;
