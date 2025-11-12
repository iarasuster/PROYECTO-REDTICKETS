import type { CollectionConfig } from 'payload'

/**
 * Colección ContenidoBlog - Versión Simplificada
 * 
 * Cada documento representa una sección del sitio.
 * Los campos son flexibles y todos están disponibles para todas las secciones.
 * Esto permite editar fácilmente desde el Admin Panel.
 */
export const ContenidoBlog: CollectionConfig = {
  slug: 'contenido-blog',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['seccion', 'titulo', 'updatedAt'],
    group: 'Contenido del Sitio',
    description: 'Contenido de las secciones del sitio web',
  },
  labels: {
    singular: 'Sección',
    plural: 'Secciones',
  },
  access: {
    read: () => true, // Público
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // ===== IDENTIFICACIÓN =====
    {
      name: 'seccion',
      type: 'select',
      required: true,
      unique: true,
      label: 'Sección del Sitio',
      options: [
        { label: 'Inicio', value: 'inicio' },
        { label: 'Sobre Nosotros', value: 'sobre_nosotros' },
        { label: 'Servicios', value: 'servicios' },
        { label: 'Comunidad', value: 'comunidad' },
        { label: 'Ayuda', value: 'ayuda' },
        { label: 'Contacto', value: 'contacto' },
      ],
    },
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título Principal',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción',
    },

    // ===== ESTADÍSTICAS (para Inicio) =====
    {
      name: 'estadisticas',
      type: 'group',
      label: 'Estadísticas',
      fields: [
        { name: 'transacciones', type: 'number', label: 'Transacciones' },
        { name: 'eventos_realizados', type: 'number', label: 'Eventos Realizados' },
        { name: 'productores', type: 'number', label: 'Productores' },
      ],
    },

    // ===== EQUIPO (para Sobre Nosotros) =====
    {
      name: 'fundadores',
      type: 'array',
      label: 'Fundadores',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true },
        { name: 'cargo', type: 'text', label: 'Cargo' },
      ],
    },
    {
      name: 'equipo',
      type: 'array',
      label: 'Equipo',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true },
        { name: 'area', type: 'text', label: 'Área' },
        { name: 'detalle', type: 'textarea', label: 'Detalle', required: false },
      ],
    },

    // ===== SERVICIOS =====
    {
      name: 'servicios_lista',
      type: 'array',
      label: 'Lista de Servicios',
      fields: [
        { name: 'servicio', type: 'textarea', label: 'Servicio' },
      ],
    },

    // ===== TESTIMONIOS (para Comunidad) =====
    {
      name: 'testimonios',
      type: 'array',
      label: 'Testimonios',
      fields: [
        { name: 'texto', type: 'textarea', label: 'Texto del Testimonio', required: true },
        { name: 'autor', type: 'text', label: 'Autor', required: true },
      ],
    },

    // ===== AYUDA - CÓMO COMPRAR =====
    {
      name: 'como_comprar',
      type: 'group',
      label: 'Cómo Comprar',
      fields: [
        { name: 'introduccion', type: 'textarea', label: 'Introducción' },
        {
          name: 'pasos',
          type: 'array',
          label: 'Pasos',
          fields: [
            { name: 'titulo', type: 'text', label: 'Título del Paso' },
            { name: 'detalle', type: 'textarea', label: 'Detalle' },
          ],
        },
      ],
    },

    // ===== AYUDA - RECEPCIÓN TICKETS =====
    {
      name: 'recepcion_tickets',
      type: 'group',
      label: 'Recepción de Tickets',
      fields: [
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
        {
          name: 'instrucciones',
          type: 'array',
          label: 'Instrucciones',
          fields: [
            { name: 'paso', type: 'text', label: 'Paso' },
          ],
        },
      ],
    },

    // ===== AYUDA - CÓMO VENDER =====
    {
      name: 'como_vender',
      type: 'group',
      label: 'Cómo Vender',
      fields: [
        { name: 'introduccion', type: 'textarea', label: 'Introducción' },
        {
          name: 'pasos',
          type: 'array',
          label: 'Pasos',
          fields: [
            { name: 'titulo', type: 'text', label: 'Título del Paso' },
            { name: 'detalle', type: 'textarea', label: 'Detalle' },
          ],
        },
      ],
    },

    // ===== AYUDA - POLÍTICAS =====
    {
      name: 'politicas',
      type: 'group',
      label: 'Políticas',
      fields: [
        { name: 'cancelacion_eventos', type: 'textarea', label: 'Cancelación de Eventos' },
        { name: 'reprogramacion', type: 'textarea', label: 'Reprogramación' },
        { name: 'imposibilidad_asistencia', type: 'textarea', label: 'Imposibilidad de Asistencia' },
      ],
    },

    // ===== AYUDA - AYUDA TÉCNICA (TÓTEM) =====
    {
      name: 'ayuda_tecnica',
      type: 'group',
      label: 'Ayuda Técnica',
      fields: [
        {
          name: 'uso_totem',
          type: 'group',
          label: 'Uso del Tótem',
          fields: [
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            { name: 'video', type: 'text', label: 'Video Tutorial' },
          ],
        },
        {
          name: 'cambio_rollo',
          type: 'array',
          label: 'Cambio de Rollo',
          fields: [
            { name: 'paso', type: 'text', label: 'Paso' },
          ],
        },
        {
          name: 'cancelar_compra_totem',
          type: 'group',
          label: 'Cancelar Compra en Tótem',
          fields: [
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            {
              name: 'campos',
              type: 'array',
              label: 'Campos Requeridos',
              fields: [
                { name: 'campo', type: 'text', label: 'Campo' },
              ],
            },
          ],
        },
        { name: 'solicitar_nuevos_rollos', type: 'textarea', label: 'Solicitar Nuevos Rollos' },
      ],
    },

    // ===== CONTACTO =====
    {
      name: 'formulario',
      type: 'array',
      label: 'Campos del Formulario',
      fields: [
        { name: 'campo', type: 'text', label: 'Nombre del Campo' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email de Contacto',
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
    },

    // ===== NOTAS INTERNAS =====
    {
      name: 'notas',
      type: 'textarea',
      label: 'Notas Internas',
      admin: {
        description: 'Notas para uso interno, no se muestran en el sitio',
      },
    },
  ],
}
