import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getContentBySection } from "../services/api";
import ChromaGrid from "./ChromaGrid";
import CommentsForm from "./CommentsForm";
import Counter from "./Counter";
import loaderAnimation from "../assets/loader.lottie";
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
        console.log("🔍 SectionContent - Slug recibido:", seccion);
        console.log("🔍 SectionContent - Campo BD:", seccionField);

        const result = await getContentBySection(seccionField);
        console.log("🔍 SectionContent - Resultado API:", result);

        if (result.success && result.data) {
          console.log("✅ SectionContent - Data recibida:", result.data);
          console.log(
            "🔍 SectionContent - Keys disponibles:",
            Object.keys(result.data)
          );
          console.log(
            "🔍 SectionContent - Estructura completa:",
            JSON.stringify(result.data, null, 2)
          );
          setContent(result.data);
          setError(null);
        } else {
          console.error("❌ SectionContent - No se encontró contenido");
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
          loop
          autoplay
          style={{ width: 200, height: 200 }}
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
const InicioContent = ({ data }) => (
  <div className="inicio-content">
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

      <div className="preview-grid">
        {/* Sobre Nosotros Preview */}
        <a href="/seccion/sobre-nosotros" className="preview-card">
          <div className="preview-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Sobre Nosotros</h3>
          <p>
            Más de 10 años conectando personas con experiencias únicas. Conoce
            nuestro equipo y trayectoria.
          </p>
          <span className="preview-link">
            Ver más <i className="fas fa-arrow-right"></i>
          </span>
        </a>

        {/* Servicios Preview */}
        <a href="/seccion/servicios" className="preview-card">
          <div className="preview-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <h3>Servicios</h3>
          <p>
            Venta de entradas, control de acceso, hard ticketing y más.
            Soluciones completas para tu evento.
          </p>
          <span className="preview-link">
            Ver más <i className="fas fa-arrow-right"></i>
          </span>
        </a>

        {/* Comunidad Preview */}
        <a href="/seccion/comunidad" className="preview-card">
          <div className="preview-icon">
            <i className="fas fa-heart"></i>
          </div>
          <h3>Comunidad</h3>
          <p>
            Lee testimonios de productores y asistentes que confían en
            RedTickets para sus eventos.
          </p>
          <span className="preview-link">
            Ver más <i className="fas fa-arrow-right"></i>
          </span>
        </a>

        {/* Ayuda Preview */}
        <a href="/seccion/ayuda" className="preview-card">
          <div className="preview-icon">
            <i className="fas fa-question-circle"></i>
          </div>
          <h3>Centro de Ayuda</h3>
          <p>
            ¿Dudas sobre cómo comprar o vender? Encuentra respuestas a las
            preguntas más frecuentes.
          </p>
          <span className="preview-link">
            Ver más <i className="fas fa-arrow-right"></i>
          </span>
        </a>
      </div>
    </div>
  </div>
);

const SobreNosotrosContent = ({ data }) => (
  <div className="sobre-nosotros-container">
    {/* FILA 1: Fundadores */}
    {data.fundadores && data.fundadores.length > 0 && (
      <div className="sobre-row fundadores-row">
        <h3 className="section-title">Fundadores</h3>
        <div className="team-grid">
          {data.fundadores.map((fundador, idx) => (
            <ChromaGrid
              key={idx}
              colors={["#ff6600", "#ff8833", "#ff9944"]}
              intensity={0.4}
            >
              <div className="team-member">
                <h4>{fundador.nombre}</h4>
                <p className="team-role">{fundador.cargo}</p>
              </div>
            </ChromaGrid>
          ))}
        </div>
      </div>
    )}

    {/* FILA 2: Equipo */}
    {data.equipo && data.equipo.length > 0 && (
      <div className="sobre-row equipo-row">
        <h3 className="section-title">Nuestro Equipo</h3>
        <div className="team-grid">
          {data.equipo.map((miembro, idx) => (
            <ChromaGrid
              key={idx}
              colors={["#ff6600", "#ff8833", "#ff9944"]}
              intensity={0.3}
            >
              <div className="team-member">
                <h4>{miembro.nombre}</h4>
                <p className="team-role">{miembro.area}</p>
                {miembro.detalle && (
                  <p className="team-detail">{miembro.detalle}</p>
                )}
              </div>
            </ChromaGrid>
          ))}
        </div>
      </div>
    )}

    {/* FILA 3: Socios Comerciales */}
    {data.socios_comerciales && (
      <div className="sobre-row socios-row">
        <h3 className="section-title">Socios Comerciales</h3>
        {data.socios_comerciales.descripcion && (
          <p className="socios-intro">{data.socios_comerciales.descripcion}</p>
        )}

        <div className="socios-grid">
          {/* Productores */}
          {data.socios_comerciales.productores && (
            <div className="socios-category">
              <h4>
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
                  <div className="logos-grid">
                    {data.socios_comerciales.productores.logos.map(
                      (logo, idx) => (
                        <div key={idx} className="logo-item">
                          {logo.imagen &&
                            typeof logo.imagen === "object" &&
                            logo.imagen.url && (
                              <img
                                src={logo.imagen.url}
                                alt={logo.nombre || "Logo"}
                              />
                            )}
                          {logo.nombre && (
                            <span className="logo-name">{logo.nombre}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Partners Tecnológicos */}
          {data.socios_comerciales.partners_tecnologicos && (
            <div className="socios-category">
              <h4>
                {data.socios_comerciales.partners_tecnologicos.titulo ||
                  "Partners Tecnológicos"}
              </h4>
              {data.socios_comerciales.partners_tecnologicos.descripcion && (
                <p className="category-desc">
                  {data.socios_comerciales.partners_tecnologicos.descripcion}
                </p>
              )}
              {data.socios_comerciales.partners_tecnologicos.logos &&
                data.socios_comerciales.partners_tecnologicos.logos.length >
                  0 && (
                  <div className="logos-grid">
                    {data.socios_comerciales.partners_tecnologicos.logos.map(
                      (logo, idx) => (
                        <div key={idx} className="logo-item">
                          {logo.imagen &&
                            typeof logo.imagen === "object" &&
                            logo.imagen.url && (
                              <img
                                src={logo.imagen.url}
                                alt={logo.nombre || "Logo"}
                              />
                            )}
                          {logo.nombre && (
                            <span className="logo-name">{logo.nombre}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Amigos E-commerce */}
          {data.socios_comerciales.amigos_ecommerce && (
            <div className="socios-category">
              <h4>
                {data.socios_comerciales.amigos_ecommerce.titulo ||
                  "Amigos E-commerce"}
              </h4>
              {data.socios_comerciales.amigos_ecommerce.descripcion && (
                <p className="category-desc">
                  {data.socios_comerciales.amigos_ecommerce.descripcion}
                </p>
              )}
              {data.socios_comerciales.amigos_ecommerce.logos &&
                data.socios_comerciales.amigos_ecommerce.logos.length > 0 && (
                  <div className="logos-grid">
                    {data.socios_comerciales.amigos_ecommerce.logos.map(
                      (logo, idx) => (
                        <div key={idx} className="logo-item">
                          {logo.imagen &&
                            typeof logo.imagen === "object" &&
                            logo.imagen.url && (
                              <img
                                src={logo.imagen.url}
                                alt={logo.nombre || "Logo"}
                              />
                            )}
                          {logo.nombre && (
                            <span className="logo-name">{logo.nombre}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}

          {/* Partners Publicitarios */}
          {data.socios_comerciales.partners_publicitarios && (
            <div className="socios-category">
              <h4>
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
                  <div className="logos-grid">
                    {data.socios_comerciales.partners_publicitarios.logos.map(
                      (logo, idx) => (
                        <div key={idx} className="logo-item">
                          {logo.imagen &&
                            typeof logo.imagen === "object" &&
                            logo.imagen.url && (
                              <img
                                src={logo.imagen.url}
                                alt={logo.nombre || "Logo"}
                              />
                            )}
                          {logo.nombre && (
                            <span className="logo-name">{logo.nombre}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

const ServiciosContent = ({ data }) => {
  // Mapeo de servicios a iconos específicos
  const getServiceIcon = (servicio) => {
    const texto = (servicio.servicio || servicio || "").toLowerCase();

    if (texto.includes("venta") || texto.includes("gestión"))
      return "fa-shopping-cart";
    if (texto.includes("compra") || texto.includes("pago"))
      return "fa-credit-card";
    if (texto.includes("app") || texto.includes("billetera"))
      return "fa-mobile-alt";
    if (
      texto.includes("diseño") ||
      texto.includes("e-ticket") ||
      texto.includes("personalizado")
    )
      return "fa-palette";
    if (
      texto.includes("hard") ||
      texto.includes("impresión") ||
      texto.includes("físicas")
    )
      return "fa-print";
    if (
      texto.includes("control") ||
      texto.includes("acceso") ||
      texto.includes("seguridad")
    )
      return "fa-shield-alt";
    if (
      texto.includes("configuración") ||
      texto.includes("descuento") ||
      texto.includes("promoción")
    )
      return "fa-cog";
    if (texto.includes("integración") || texto.includes("sistema"))
      return "fa-plug";
    if (
      texto.includes("atención") ||
      texto.includes("cliente") ||
      texto.includes("soporte")
    )
      return "fa-headset";
    if (texto.includes("seguro") || texto.includes("metlife"))
      return "fa-umbrella";
    if (texto.includes("acreditaciones") || texto.includes("credenciales"))
      return "fa-id-card";

    return "fa-ticket-alt"; // Default
  };

  return (
    <div className="servicios-container">
      {data.servicios_lista && data.servicios_lista.length > 0 && (
        <div className="servicios-grid-container">
          {data.servicios_lista.map((item, idx) => (
            <div key={idx} className="servicio-card animate-item">
              <div className="servicio-icon">
                <i className={`fas ${getServiceIcon(item)}`}></i>
              </div>
              <h4>{item.servicio || item}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ComunidadContent = ({ data }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dynamicTestimonios, setDynamicTestimonios] = useState([]);

  const handleCommentSubmitted = (newComment) => {
    console.log("✅ Nuevo testimonio enviado:", newComment);

    // Si el comentario fue publicado automáticamente, recargar la lista
    if (newComment.status === "publicado") {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="comunidad-container">
      {/* Testimonios: Estáticos del CMS + Dinámicos de la DB */}
      <div className="content-item testimonios animate-item">
        <h3>Lo que dicen nuestros clientes</h3>

        {/* CommentsList interno que pasa los testimonios al padre */}
        <TestimoniosUnified
          staticTestimonios={data.testimonios || []}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Formulario para agregar testimonios dinámicos */}
      <div className="content-item comments-form-wrapper animate-item">
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
          `${API_BASE_URL}/comments?where[status][equals]=publicado&sort=-createdAt&limit=50`
        );

        if (response.ok) {
          const result = await response.json();
          if (result.docs) {
            setDynamicTestimonios(result.docs);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching dynamic testimonios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicTestimonios();
  }, [refreshTrigger]);

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

  if (allTestimonios.length === 0 && !loading) {
    return null; // No mostrar nada si no hay testimonios
  }

  return (
    <div className="testimonios-grid">
      {allTestimonios.map((testimonio, idx) => (
        <div key={`${testimonio.tipo}-${idx}`} className="testimonio">
          <p className="testimonio-texto">"{testimonio.texto}"</p>
          <p className="testimonio-autor">— {testimonio.autor}</p>
        </div>
      ))}
      {loading && (
        <div className="testimonio loading-placeholder">
          <p className="testimonio-texto">Cargando testimonios...</p>
        </div>
      )}
    </div>
  );
};

const AyudaContent = ({ data }) => {
  const [activeTab, setActiveTab] = useState("comprar");

  const tabs = [
    { id: "comprar", label: "Cómo Comprar", icon: "fa-shopping-cart" },
    { id: "vender", label: "Cómo Vender", icon: "fa-money-bill-wave" },
    { id: "recepcion", label: "Recepción", icon: "fa-envelope" },
    { id: "politicas", label: "Políticas", icon: "fa-file-contract" },
    { id: "tecnica", label: "Ayuda Técnica", icon: "fa-tools" },
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
            <i className={`fas ${tab.icon} tab-icon`}></i>
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
                      <p>{paso.detalle}</p>
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

        {activeTab === "recepcion" && data.recepcion_tickets && (
          <div className="tab-panel animate-in">
            <h3>Recepción de Tickets</h3>
            <p className="intro-text">{data.recepcion_tickets.descripcion}</p>
            {data.recepcion_tickets.instrucciones && (
              <ol className="instrucciones-lista">
                {data.recepcion_tickets.instrucciones.map(
                  (instruccion, idx) => (
                    <li key={idx}>
                      {typeof instruccion === "string"
                        ? instruccion
                        : instruccion.paso}
                    </li>
                  )
                )}
              </ol>
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

        {activeTab === "tecnica" && data.ayuda_tecnica && (
          <div className="tab-panel animate-in">
            <h3>Ayuda Técnica</h3>
            <p className="intro-text">{data.ayuda_tecnica.descripcion}</p>
            {data.ayuda_tecnica.contacto && (
              <div className="ayuda-item">
                <h4>Contacto</h4>
                <p>
                  <strong>Email:</strong> {data.ayuda_tecnica.contacto.email}
                </p>
                {data.ayuda_tecnica.contacto.telefono && (
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {data.ayuda_tecnica.contacto.telefono}
                  </p>
                )}
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
