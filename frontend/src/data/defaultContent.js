// Contenido por defecto para cada sección del sitio
// Este contenido se muestra cuando no hay contenido en la base de datos

export const defaultContent = {
  inicio: [
    {
      id: "default-hero-inicio",
      titulo: "Creamos experiencias, gestionamos momentos.",
      seccion: "inicio",
      tipo: "texto",
      contenido:
        "En RedTickets acompañamos a productores, artistas y marcas a conectar con su público. Este espacio muestra algunos de los proyectos que hicimos posibles.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-bloque-1",
      titulo: "Eventos destacados",
      seccion: "inicio",
      tipo: "servicio",
      contenido:
        "Una selección de experiencias únicas gestionadas junto a nuestros clientes.",
      publicado: true,
      orden: 2,
    },
    {
      id: "default-bloque-2",
      titulo: "Nuestros servicios",
      seccion: "inicio",
      tipo: "servicio",
      contenido: "Descubrí cómo RedTickets potencia cada etapa de un evento.",
      publicado: true,
      orden: 3,
    },
    {
      id: "default-bloque-3",
      titulo: "Historias reales",
      seccion: "inicio",
      tipo: "servicio",
      contenido: "Lo que dicen quienes confían en nosotros.",
      publicado: true,
      orden: 4,
    },
    {
      id: "default-impacto",
      titulo: "Los números también cuentan.",
      seccion: "inicio",
      tipo: "texto",
      contenido:
        "Más de 2.000 eventos gestionados. Miles de asistentes conectados. Una red de productores y artistas que sigue creciendo.",
      publicado: true,
      orden: 5,
    },
  ],

  "sobre-nosotros": [
    {
      id: "default-intro-sobre",
      titulo: "Más que una ticketera.",
      seccion: "sobre-nosotros",
      tipo: "texto",
      contenido:
        "Nacimos con una idea clara: hacer que cada evento sea una experiencia fluida, desde la venta de entradas hasta el último aplauso. En RedTickets combinamos tecnología, diseño y acompañamiento humano para que organizadores y asistentes vivan cada etapa con confianza. Somos un equipo multidisciplinario con una pasión en común: conectar personas a través de la cultura y el entretenimiento.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-historia",
      titulo: "Nuestra historia",
      seccion: "sobre-nosotros",
      tipo: "servicio",
      contenido:
        "Más de una década impulsando experiencias únicas en todo el país.",
      publicado: true,
      orden: 2,
    },
    {
      id: "default-inspiracion",
      titulo: "Qué nos inspira",
      seccion: "sobre-nosotros",
      tipo: "servicio",
      contenido:
        "La energía de los eventos en vivo, la creatividad y la conexión humana.",
      publicado: true,
      orden: 3,
    },
    {
      id: "default-equipo",
      titulo: "El equipo",
      seccion: "sobre-nosotros",
      tipo: "servicio",
      contenido:
        "Profesionales de tecnología, diseño y producción trabajando codo a codo con nuestros clientes.",
      publicado: true,
      orden: 4,
    },
  ],

  servicios: [
    {
      id: "default-intro-servicios",
      titulo: "Soluciones a medida para cada evento.",
      seccion: "servicios",
      tipo: "texto",
      contenido:
        "Brindamos acompañamiento integral a lo largo de todo el proceso, con herramientas flexibles y un equipo que te respalda.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-servicio-1",
      titulo: "Venta y gestión de entradas",
      seccion: "servicios",
      tipo: "servicio",
      contenido:
        "Plataforma intuitiva, segura y adaptable a cualquier tipo de evento.",
      publicado: true,
      orden: 2,
    },
    {
      id: "default-servicio-2",
      titulo: "Acompañamiento a productores",
      seccion: "servicios",
      tipo: "servicio",
      contenido:
        "Asesoramiento personalizado antes, durante y después del evento.",
      publicado: true,
      orden: 3,
    },
    {
      id: "default-servicio-3",
      titulo: "Comunicación y diseño",
      seccion: "servicios",
      tipo: "servicio",
      contenido:
        "Material gráfico, identidad visual y estrategias digitales que potencian la experiencia.",
      publicado: true,
      orden: 4,
    },
    {
      id: "default-servicio-4",
      titulo: "Soporte técnico y atención",
      seccion: "servicios",
      tipo: "servicio",
      contenido: "Siempre disponibles para que todo funcione como esperás.",
      publicado: true,
      orden: 5,
    },
  ],

  comunidad: [
    {
      id: "default-intro-comunidad",
      titulo: "La voz de quienes hacen posible RedTickets.",
      seccion: "comunidad",
      tipo: "texto",
      contenido:
        "Cada evento cuenta una historia. En esta sección reunimos los testimonios, experiencias y resultados de quienes confían en nosotros para llevar sus ideas al siguiente nivel.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-testimonio-1",
      titulo: "Festival Música en Vivo 2024",
      seccion: "comunidad",
      tipo: "testimonio",
      contenido:
        "La atención fue impecable y la plataforma nos permitió vender entradas sin complicaciones.",
      publicado: true,
      orden: 2,
      metadata: {
        autor: "Festival Música en Vivo",
        cargo: "Productor",
        calificacion: 5,
      },
    },
    {
      id: "default-casos",
      titulo: "Casos destacados",
      seccion: "comunidad",
      tipo: "texto",
      contenido:
        "Explorá proyectos reales y conocé cómo trabajamos junto a cada cliente para crear experiencias únicas.",
      publicado: true,
      orden: 3,
    },
    {
      id: "default-formulario-feedback",
      titulo: "Tu opinión también cuenta",
      seccion: "comunidad",
      tipo: "formulario",
      contenido:
        "Si trabajaste con nosotros, dejá tu comentario y contanos cómo fue tu experiencia.",
      publicado: true,
      orden: 4,
    },
  ],

  ayuda: [
    {
      id: "default-intro-ayuda",
      titulo: "¿Tenés dudas? Estamos para ayudarte.",
      seccion: "ayuda",
      tipo: "texto",
      contenido:
        "Encontrá respuestas rápidas sobre cómo usar RedTickets, o escribinos para recibir asistencia personalizada.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-ayuda-1",
      titulo: "Guías para productores",
      seccion: "ayuda",
      tipo: "lista",
      contenido: "Primeros pasos para publicar tu evento en la plataforma.",
      publicado: true,
      orden: 2,
    },
    {
      id: "default-ayuda-2",
      titulo: "Políticas de devoluciones",
      seccion: "ayuda",
      tipo: "lista",
      contenido: "Cómo solicitar una devolución o cambio de entradas.",
      publicado: true,
      orden: 3,
    },
    {
      id: "default-ayuda-3",
      titulo: "Soporte técnico",
      seccion: "ayuda",
      tipo: "lista",
      contenido: "Contacto directo para incidencias en la plataforma.",
      publicado: true,
      orden: 4,
    },
  ],

  contacto: [
    {
      id: "default-intro-contacto",
      titulo: "Conectemos.",
      seccion: "contacto",
      tipo: "texto",
      contenido:
        "¿Querés que tu evento sea parte del próximo caso de éxito de RedTickets? Escribinos y charlemos sobre cómo podemos acompañarte.",
      publicado: true,
      orden: 1,
    },
    {
      id: "default-form-contacto",
      titulo: "Formulario de Contacto",
      seccion: "contacto",
      tipo: "formulario",
      contenido:
        "También podés escribirnos a contacto@redtickets.net o contactarnos en nuestras redes.",
      publicado: true,
      orden: 2,
    },
  ],
};
