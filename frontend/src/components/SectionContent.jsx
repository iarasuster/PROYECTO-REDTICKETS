import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getContentBySection, SERVER_URL } from "../services/api";
import ChromaGrid from "./ChromaGrid";
import CommentsForm from "./CommentsForm";
import Counter from "./Counter";
import LogoCarousel from "./LogoCarousel";
import TestimoniosCarousel from "./TestimoniosCarousel";
import BentoGrid from "./BentoGrid";
import loaderAnimation from "../assets/loader.lottie";

function getImageUrl(imageObj) {
  if (!imageObj) return "";
  if (imageObj.url) return imageObj.url;
  if (imageObj.filename) return `${SERVER_URL}/media/${imageObj.filename}`;
  return "";
}
import "./SectionContent.css";

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
    return (
      <div className="section-loading">
        <DotLottieReact
          src={loaderAnimation}
          autoplay
          loop
          style={{ width: 350, height: 350 }}
        />
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

      {/* Video Institucional */}
      <div className="inicio-video animate-item">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/aoC7rMeNZNY"
            title="Video Institucional - RedTickets"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Preview de Secciones - Magic Bento Style */}
      <div className="sections-preview animate-item">
        <h2 className="preview-title">Descubre RedTickets</h2>

        <div className="magic-bento-grid">
          {/* Sobre Nosotros - Grande inicialmente */}
          <a href="/seccion/sobre-nosotros" className="bento-item bento-large">
            <div className="bento-content">
              <div className="bento-header">
                <h3>Sobre Nosotros</h3>
                <span className="bento-arrow">→</span>
              </div>
              <p>
                Más de 10 años conectando personas con experiencias únicas.
                Conoce nuestro equipo, nuestra historia y la pasión que nos
                impulsa día a día.
              </p>
            </div>
          </a>

          {/* Servicios */}
          <a href="/seccion/servicios" className="bento-item">
            <div className="bento-content">
              <div className="bento-header">
                <h3>Servicios</h3>
                <span className="bento-arrow">→</span>
              </div>
              <p>
                Venta de entradas, control de acceso, hard ticketing, streaming
                y más. Soluciones completas e integrales para tu evento.
              </p>
            </div>
          </a>

          {/* Comunidad */}
          <a href="/seccion/comunidad" className="bento-item">
            <div className="bento-content">
              <div className="bento-header">
                <h3>Comunidad</h3>
                <span className="bento-arrow">→</span>
              </div>
              <p>
                Lee testimonios de productores y asistentes que confían en
                RedTickets para crear experiencias inolvidables.
              </p>
            </div>
          </a>

          {/* Ayuda */}
          <a href="/seccion/ayuda" className="bento-item">
            <div className="bento-content">
              <div className="bento-header">
                <h3>Centro de Ayuda</h3>
                <span className="bento-arrow">→</span>
              </div>
              <p>
                ¿Dudas sobre cómo comprar o vender entradas? Encuentra
                respuestas a las preguntas más frecuentes y soporte
                personalizado.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente para la sección SOBRE NOSOTROS
function SobreNosotrosContent({ data }) {
  const [activeFounder, setActiveFounder] = useState(null);

  return (
    <div className="sobre-nosotros-container">
      {/* Descripción principal */}
      {data.quienes_somos && (
        <div className="sobre-row intro-row">
          <p className="sobre-text-intro">{data.quienes_somos}</p>
        </div>
      )}

      {/* FILA 4-5: Nuestra Misión y Cultura */}
      {(data.mision || data.cultura) && (
        <div className="sobre-row mision-cultura-row">
          {data.mision && (
            <div className="mision-cultura-item">
              <h3 className="section-title">Nuestra Misión</h3>
              <p className="sobre-text">{data.mision}</p>
            </div>
          )}
          {data.cultura && (
            <div className="mision-cultura-item">
              <h3 className="section-title">Nuestra Cultura</h3>
              <p className="sobre-text">{data.cultura}</p>
            </div>
          )}
        </div>
      )}

      {/* FILA 2: Fundadores - Foto Grupal con Tooltips */}
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

      {/* FILA 3: Equipo */}
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

      {/* FILA 4: Trayectoria e Impacto */}
      {data.trayectoria_impacto && (
        <div className="sobre-row trayectoria-row animate-item">
          <h3 className="section-title">Trayectoria e Impacto</h3>
          <p className="sobre-text">{data.trayectoria_impacto}</p>
        </div>
      )}

      {/* FILA 5: Nuestra Historia - Timeline visual */}
      <div className="sobre-row historia-row animate-item">
        <div className="timeline-blocks">
          <div className="timeline-card">
            <div className="timeline-year">2015</div>
            <div className="timeline-title">Fundación & Reconocimiento</div>
            <div className="timeline-text">
              RedTickets nace como la primera y única ticketera
              autogestionable de Uruguay.
              <br />
              Ese mismo año, recibe el reconocimiento de ANII como "Proyecto
              de Innovación del Año", marcando el inicio de una nueva era en
              la gestión de eventos.
            </div>
          </div>
          <div className="timeline-card">
            <div className="timeline-year">2016</div>
            <div className="timeline-title">Lanzamiento al Mercado</div>
            <div className="timeline-text">
              Abril 2016: RedTickets inicia operaciones, acercando
              tecnología y autonomía a productores y asistentes en todo el
              país.
            </div>
          </div>
          <div className="timeline-card">
            <div className="timeline-year">2017</div>
            <div className="timeline-title">Innovación en el Fútbol</div>
            <div className="timeline-text">
              Primer ticket digital del fútbol uruguayo.
              <br />
              RedTickets se convierte en la ticketera oficial de la
              Selección Uruguaya de Fútbol y participa en eventos
              internacionales de Conmebol, consolidando su liderazgo en el
              sector.
            </div>
          </div>
          <div className="timeline-card">
            <div className="timeline-year">2019</div>
            <div className="timeline-title">
              Expansión & Internacionalización
            </div>
            <div className="timeline-text">
              Seleccionada por el Programa de Apoyo al Crecimiento de ANII.
              <br />
              Este impulso permite a RedTickets expandir su alcance y
              proyectarse internacionalmente, manteniendo el compromiso con
              la innovación y la excelencia.
            </div>
          </div>
        </div>
      </div>

      {/* FILA 6: Socios Comerciales - Título General */}
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

      {/* FILA 7: Productores */}
      {data.socios_comerciales?.productores && (
        <div className="sobre-row socios-category-row">
          <h4 className="socios-category-title">
            {data.socios_comerciales.productores.titulo ||
              "Amigos Productores"}
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

      {/* FILA 8: Partners Publicitarios */}
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
            data.socios_comerciales.partners_publicitarios.logos.length >
              0 && (
              <LogoCarousel
                logos={data.socios_comerciales.partners_publicitarios.logos}
                speed={45}
              />
            )}
        </div>
      )}
    </div>
  );
}

const ServiciosContent = ({ data }) => {
  const serviceColor = "#ff6600";
  const serviceGradient = "linear-gradient(135deg, #ff6600 0%, #ff8833 100%)";

  // Mapeo de servicios a iconos
  const getServiceIcon = (servicio) => {
    const texto = (servicio.servicio || servicio || "").toLowerCase();

    if (texto.includes("venta") || texto.includes("gestión")) return "fa-shopping-cart";
    if (texto.includes("compra") || texto.includes("pago")) return "fa-credit-card";
    if (texto.includes("app") || texto.includes("billetera")) return "fa-mobile-alt";
    if (texto.includes("diseño") || texto.includes("e-ticket") || texto.includes("personalizado")) return "fa-palette";
    if (texto.includes("hard") || texto.includes("impresión") || texto.includes("físicas")) return "fa-print";
    if (texto.includes("control") || texto.includes("acceso") || texto.includes("seguridad")) return "fa-shield-alt";
    if (texto.includes("configuración") || texto.includes("descuento") || texto.includes("promoción")) return "fa-cog";
    if (texto.includes("integración") || texto.includes("sistema")) return "fa-plug";
    if (texto.includes("atención") || texto.includes("cliente") || texto.includes("soporte")) return "fa-headset";
    if (texto.includes("seguro") || texto.includes("metlife")) return "fa-umbrella";
    if (texto.includes("acreditaciones") || texto.includes("credenciales")) return "fa-id-card";

    return "fa-ticket-alt";
  };

  return (
    <div className="servicios-container">
      {/* Grid de servicios profesional */}
      {data.servicios_lista && data.servicios_lista.length > 0 && (
        <div className="servicios-grid">
          {data.servicios_lista.map((item, idx) => {
            const icon = getServiceIcon(item);
            return (
              <div key={idx} className="servicio-card" data-index={idx}>
                <div className="servicio-card-inner">
                  <div
                    className="servicio-icon-wrapper"
                    style={{ "--icon-gradient": serviceGradient }}
                  >
                    <i className={`fas ${icon} servicio-card-icon`}></i>
                  </div>
                  <div className="servicio-card-content">
                    <p className="servicio-card-text">
                      {item.servicio || item}
                    </p>
                  </div>
                  <div
                    className="servicio-card-glow"
                    style={{ "--glow-color": serviceColor }}
                  ></div>
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

  return <TestimoniosCarousel testimonios={allTestimonios} loading={loading} />;
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
    { id: "datos", label: "Preguntas Frecuentes" },
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
            
            {/* Video Tutorial */}
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/SfHuVUmpzgU"
                title="Tutorial de Compra - RedTickets"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
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
            <h3>Preguntas Frecuentes</h3>

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
                {Array.isArray(
                  data.ayuda_tecnica.cancelar_compra_totem?.campos,
                ) &&
                  data.ayuda_tecnica.cancelar_compra_totem.campos.length >
                    0 && (
                    <AyudaForm
                      campos={data.ayuda_tecnica.cancelar_compra_totem.campos}
                      submitText="Enviar Solicitud"
                    />
                  )}
              </div>
            )}

            {/* Solicitar Rollos */}
            {data.ayuda_tecnica.solicitar_nuevos_rollos && (
              <div className="ayuda-item">
                <h4>Solicitar Nuevos Rollos</h4>
                <p>{data.ayuda_tecnica.solicitar_nuevos_rollos}</p>
                <AyudaForm
                  campos={[
                    { campo: "Cantidad de Rollos", type: "number", min: 1 },
                    { campo: "Lugar o Evento", type: "text" },
                  ]}
                  submitText="Solicitar Rollos"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ContactoContent = ({ data }) => {
  const [formMessage, setFormMessage] = useState(null);
  useEffect(() => {
    if (formMessage) {
      const timeout = setTimeout(() => setFormMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [formMessage]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;
    for (const el of form.elements) {
      if (
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
        el.hasAttribute("required") &&
        !el.value.trim()
      ) {
        valid = false;
      }
    }
    if (!valid) {
      setFormMessage({
        type: "error",
        text: "Por favor completa todos los campos.",
      });
      return;
    }
    setFormMessage({
      type: "success",
      text: "¡Mensaje enviado! Nos pondremos en contacto.",
    });
    form.reset();
  };
  return (
    <div className="content-grid">
      {Array.isArray(data.formulario) && data.formulario.length > 0 && (
        <div className="content-item formulario animate-item">
          <form className="contact-form" onSubmit={handleSubmit}>
            {data.formulario.map((campo, idx) => {
              const fieldName = typeof campo === "string" ? campo : campo.campo;
              const isTextarea = fieldName.toLowerCase().includes("mensaje");
              const isTipoConsulta =
                fieldName.toLowerCase().includes("tipo") &&
                fieldName.toLowerCase().includes("consulta");

              return (
                <div key={idx} className="form-group">
                  <label>{fieldName}</label>
                  {isTextarea ? (
                    <textarea
                      placeholder={`Ingresa tu ${fieldName.toLowerCase()}`}
                      required
                    />
                  ) : isTipoConsulta ? (
                    <select required>
                      <option value="">Selecciona una opción</option>
                      <option value="organizar-evento">
                        Quiero organizar un evento
                      </option>
                      <option value="saber-servicios">
                        Saber más sobre sus servicios
                      </option>
                      <option value="redtickets-pais">
                        Quiero a RedTickets en mi país
                      </option>
                      <option value="ayuda-comprar">
                        Quiero ayuda para comprar
                      </option>
                      <option value="otro">Otro</option>
                    </select>
                  ) : (
                    <input
                      type={
                        fieldName.toLowerCase().includes("email")
                          ? "email"
                          : "text"
                      }
                      placeholder={`Ingresa tu ${fieldName.toLowerCase()}`}
                      required
                    />
                  )}
                </div>
              );
            })}
            <button type="submit" className="btn btn-large">
              Enviar mensaje
            </button>
            {formMessage && (
              <div className={`form-message ${formMessage.type}`}>
                {formMessage.text}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

const GenericContent = ({ data }) => (
  <div className="content-grid">
    <div className="content-item texto animate-item">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  </div>
);

// Formulario reutilizable para ayuda técnica
function AyudaForm({ campos, submitText }) {
  const [formMessage, setFormMessage] = useState(null);
  useEffect(() => {
    if (formMessage) {
      const timeout = setTimeout(() => setFormMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [formMessage]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;
    for (const el of form.elements) {
      if (
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
        el.hasAttribute("required") &&
        !el.value.trim()
      ) {
        valid = false;
      }
    }
    if (!valid) {
      setFormMessage({
        type: "error",
        text: "Por favor completa todos los campos.",
      });
      return;
    }
    setFormMessage({
      type: "success",
      text: "¡Mensaje enviado! Nos pondremos en contacto.",
    });
    form.reset();
  };
  if (!Array.isArray(campos) || campos.length === 0) return null;
  return (
    <form className="ayuda-form" onSubmit={handleSubmit}>
      {campos.map((item, idx) => {
        const fieldName = typeof item === "string" ? item : item.campo;
        const isTextarea = fieldName.toLowerCase().includes("motivo");
        const type = typeof item === "object" && item.type ? item.type : "text";
        const min = typeof item === "object" && item.min ? item.min : undefined;
        return (
          <div key={item.id || idx} className="form-group">
            <label>{fieldName}</label>
            {isTextarea ? (
              <textarea
                placeholder={`Ingresa ${fieldName.toLowerCase()}`}
                rows="3"
                required
              />
            ) : (
              <input
                type={type}
                min={min}
                placeholder={`Ingresa ${fieldName.toLowerCase()}`}
                required
              />
            )}
          </div>
        );
      })}
      <button type="submit" className="btn-primary">
        {submitText}
      </button>
      {formMessage && (
        <div className={`form-message ${formMessage.type}`}>
          {formMessage.text}
        </div>
      )}
    </form>
  );
}

export default SectionContent;
