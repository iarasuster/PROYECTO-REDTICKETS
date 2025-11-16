import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getContentBySection } from "../services/api";
import ChromaGrid from "./ChromaGrid";
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
          console.log("🔍 SectionContent - Keys disponibles:", Object.keys(result.data));
          console.log("🔍 SectionContent - Estructura completa:", JSON.stringify(result.data, null, 2));
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
  <div className="content-grid">
    {data.titulo && (
      <div className="content-item texto animate-item">
        <h2>{data.titulo}</h2>
        {data.descripcion && <p>{data.descripcion}</p>}
      </div>
    )}

    {data.estadisticas && (
      <div className="content-item estadisticas animate-item">
        <h3>Nuestros Números</h3>
        <div className="stats-grid">
          {data.estadisticas.transacciones && (
            <div className="stat-card">
              <div className="stat-number">
                {data.estadisticas.transacciones.toLocaleString()}
              </div>
              <div className="stat-label">Transacciones</div>
            </div>
          )}
          {data.estadisticas.eventos_realizados && (
            <div className="stat-card">
              <div className="stat-number">
                {data.estadisticas.eventos_realizados.toLocaleString()}
              </div>
              <div className="stat-label">Eventos Realizados</div>
            </div>
          )}
          {data.estadisticas.productores && (
            <div className="stat-card">
              <div className="stat-number">
                {data.estadisticas.productores.toLocaleString()}
              </div>
              <div className="stat-label">Productores</div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

const SobreNosotrosContent = ({ data }) => (
  <div className="content-grid">
    <div className="content-item texto animate-item">
      <h2>{data.titulo}</h2>
      <p>{data.descripcion}</p>
    </div>

    {data.fundadores && data.fundadores.length > 0 && (
      <div className="content-item fundadores animate-item">
        <h3>Fundadores</h3>
        <div className="team-grid">
          {data.fundadores.map((fundador, idx) => (
            <ChromaGrid key={idx} colors={['#ff6600', '#ff8833', '#ff9944']} intensity={0.4}>
              <div className="team-member">
                <h4>{fundador.nombre}</h4>
                <p className="team-role">{fundador.cargo}</p>
              </div>
            </ChromaGrid>
          ))}
        </div>
      </div>
    )}

    {data.equipo && data.equipo.length > 0 && (
      <div className="content-item equipo animate-item">
        <h3>Nuestro Equipo</h3>
        <div className="team-grid">
          {data.equipo.map((miembro, idx) => (
            <ChromaGrid key={idx} colors={['#ff6600', '#ff8833', '#ff9944']} intensity={0.3}>
              <div className="team-member">
                <h4>{miembro.nombre}</h4>
                <p className="team-role">{miembro.area}</p>
                {miembro.detalle && <p className="team-detail">{miembro.detalle}</p>}
              </div>
            </ChromaGrid>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ServiciosContent = ({ data }) => (
  <div className="content-grid">
    {data.titulo && (
      <div className="content-item texto animate-item">
        <h2>{data.titulo}</h2>
      </div>
    )}

    {data.descripcion && (
      <div className="content-item texto animate-item">
        <p>{data.descripcion}</p>
      </div>
    )}

    {data.servicios_lista && data.servicios_lista.length > 0 && (
      <div className="content-item servicios-lista animate-item">
        <h3>Nuestros Servicios</h3>
        <ul className="servicios-list">
          {data.servicios_lista.map((item, idx) => (
            <li key={idx} className="servicio-item">
              {item.servicio || item}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const ComunidadContent = ({ data }) => (
  <div className="content-grid">
    {data.descripcion && (
      <div className="content-item texto animate-item">
        <p>{data.descripcion}</p>
      </div>
    )}

    {data.testimonios && data.testimonios.length > 0 && (
      <div className="content-item testimonios animate-item">
        <h3>Lo que dicen nuestros clientes</h3>
        <div className="testimonios-grid">
          {data.testimonios.map((testimonio, idx) => (
            <div key={idx} className="testimonio">
              <p className="testimonio-texto">"{testimonio.texto}"</p>
              <p className="testimonio-autor">— {testimonio.autor}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const AyudaContent = ({ data }) => (
  <div className="content-grid">
    {data.descripcion_general && (
      <div className="content-item texto animate-item">
        <p>{data.descripcion_general}</p>
      </div>
    )}

    {data.como_comprar && (
      <div className="content-item faq-section animate-item">
        <h3>Cómo Comprar</h3>
        <p>{data.como_comprar.introduccion}</p>
        {data.como_comprar.pasos && (
          <div className="pasos-lista">
            {data.como_comprar.pasos.map((paso, idx) => (
              <div key={idx} className="paso-item">
                <h4>{idx + 1}. {paso.titulo}</h4>
                <p>{paso.detalle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {data.recepcion_tickets && (
      <div className="content-item faq-section animate-item">
        <h3>Recepción de Tickets</h3>
        <p>{data.recepcion_tickets.descripcion}</p>
        {data.recepcion_tickets.instrucciones && (
          <ol className="instrucciones-lista">
            {data.recepcion_tickets.instrucciones.map((instruccion, idx) => (
              <li key={idx}>{typeof instruccion === "string" ? instruccion : instruccion.paso}</li>
            ))}
          </ol>
        )}
      </div>
    )}

    {data.como_vender && (
      <div className="content-item faq-section animate-item">
        <h3>Cómo Vender</h3>
        <p>{data.como_vender.introduccion}</p>
        {data.como_vender.pasos && (
          <div className="pasos-lista">
            {data.como_vender.pasos.map((paso, idx) => (
              <div key={idx} className="paso-item">
                <h4>{idx + 1}. {paso.titulo}</h4>
                <p>{paso.detalle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {data.politicas && (
      <div className="content-item faq-section animate-item">
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
        {data.politicas.imposibilidad_asistencia && (
          <div className="politica-item">
            <h4>Imposibilidad de Asistencia</h4>
            <p>{data.politicas.imposibilidad_asistencia}</p>
          </div>
        )}
      </div>
    )}

    {data.ayuda_tecnica && (
      <div className="content-item faq-section animate-item">
        <h3>Ayuda Técnica - Tótem</h3>
        
        {data.ayuda_tecnica.uso_totem && (
          <div className="ayuda-item">
            <h4>Uso del Tótem</h4>
            <p>{data.ayuda_tecnica.uso_totem.descripcion}</p>
            {data.ayuda_tecnica.uso_totem.video && (
              <p><strong>{data.ayuda_tecnica.uso_totem.video}</strong></p>
            )}
          </div>
        )}

        {data.ayuda_tecnica.cambio_rollo && data.ayuda_tecnica.cambio_rollo.length > 0 && (
          <div className="ayuda-item">
            <h4>Cambio de Rollo</h4>
            <ol className="instrucciones-lista">
              {data.ayuda_tecnica.cambio_rollo.map((item, idx) => (
                <li key={idx}>{typeof item === "string" ? item : item.paso}</li>
              ))}
            </ol>
          </div>
        )}

        {data.ayuda_tecnica.cancelar_compra_totem && (
          <div className="ayuda-item">
            <h4>Cancelar Compra en Tótem</h4>
            <p>{data.ayuda_tecnica.cancelar_compra_totem.descripcion}</p>
            {data.ayuda_tecnica.cancelar_compra_totem.campos && (
              <form className="ayuda-form" onSubmit={(e) => e.preventDefault()}>
                {data.ayuda_tecnica.cancelar_compra_totem.campos.map((item, idx) => {
                  const fieldName = typeof item === "string" ? item : item.campo;
                  return (
                    <div key={idx} className="form-group">
                      <label>{fieldName}</label>
                      <input
                        type="text"
                        placeholder={`Ingresa ${fieldName.toLowerCase()}`}
                        required
                      />
                    </div>
                  );
                })}
                <button type="submit" className="btn btn-primary">Enviar solicitud</button>
              </form>
            )}
          </div>
        )}

        {data.ayuda_tecnica.solicitar_nuevos_rollos && (
          <div className="ayuda-item">
            <h4>Solicitar Nuevos Rollos</h4>
            <p>{data.ayuda_tecnica.solicitar_nuevos_rollos}</p>
            <form className="ayuda-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Cantidad de rollos</label>
                <input
                  type="number"
                  placeholder="Ingresa la cantidad"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Lugar de entrega</label>
                <input
                  type="text"
                  placeholder="Ingresa el lugar"
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo de contacto</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Solicitar rollos</button>
            </form>
          </div>
        )}
      </div>
    )}
  </div>
);

const ContactoContent = ({ data }) => (
  <div className="content-grid">
    {data.descripcion && (
      <div className="content-item texto animate-item">
        <p>{data.descripcion}</p>
      </div>
    )}

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
                  <textarea placeholder={`Ingresa tu ${fieldName.toLowerCase()}`} />
                ) : (
                  <input
                    type={fieldName.toLowerCase().includes("email") ? "email" : "text"}
                    placeholder={`Ingresa tu ${fieldName.toLowerCase()}`}
                  />
                )}
              </div>
            );
          })}
          <button type="submit" className="btn btn-large">Enviar mensaje</button>
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
