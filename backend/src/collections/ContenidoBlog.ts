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
      admin: {
        condition: (data) => data.seccion === 'inicio',
      },
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
      admin: {
        condition: (data) => data.seccion === 'sobre_nosotros',
      },
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true },
        { name: 'cargo', type: 'text', label: 'Cargo' },
        { 
          name: 'imagen', 
          type: 'upload', 
          relationTo: 'media', 
          label: 'Foto de Perfil',
          admin: {
            description: 'Imagen circular del fundador',
          },
        },
      ],
    },
    {
      name: 'equipo',
      type: 'array',
      label: 'Equipo',
      admin: {
        condition: (data) => data.seccion === 'sobre_nosotros',
      },
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true },
        { name: 'area', type: 'text', label: 'Área' },
        { 
          name: 'imagen', 
          type: 'upload', 
          relationTo: 'media', 
          label: 'Foto de Perfil',
          admin: {
            description: 'Imagen circular del miembro del equipo',
          },
        },
      ],
    },
    {
      name: 'socios_comerciales',
      type: 'group',
      label: 'Socios Comerciales',
      admin: {
        condition: (data) => data.seccion === 'sobre_nosotros',
      },
      fields: [
        { 
          name: 'descripcion', 
          type: 'textarea', 
          label: 'Descripción General',
          admin: {
            description: 'Texto introductorio de la sección de socios',
          },
        },
        {
          name: 'productores',
          type: 'group',
          label: 'Productores',
          fields: [
            { 
              name: 'titulo', 
              type: 'text', 
              label: 'Título de la Sección',
              defaultValue: 'Amigos Productores',
            },
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            {
              name: 'logos',
              type: 'array',
              label: 'Logos',
              fields: [
                { name: 'nombre', type: 'text', label: 'Nombre' },
                { 
                  name: 'imagen', 
                  type: 'upload', 
                  relationTo: 'media',
                  label: 'Logo/Imagen',
                },
              ],
            },
          ],
        },
        {
          name: 'partners_tecnologicos',
          type: 'group',
          label: 'Partners Tecnológicos',
          fields: [
            { 
              name: 'titulo', 
              type: 'text', 
              label: 'Título de la Sección',
              defaultValue: 'Partners Tecnológicos',
            },
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            {
              name: 'logos',
              type: 'array',
              label: 'Logos',
              fields: [
                { name: 'nombre', type: 'text', label: 'Nombre' },
                { 
                  name: 'imagen', 
                  type: 'upload', 
                  relationTo: 'media',
                  label: 'Logo/Imagen',
                },
              ],
            },
          ],
        },
        {
          name: 'amigos_ecommerce',
          type: 'group',
          label: 'Amigos E-commerce',
          fields: [
            { 
              name: 'titulo', 
              type: 'text', 
              label: 'Título de la Sección',
              defaultValue: 'Amigos E-commerce',
            },
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            {
              name: 'logos',
              type: 'array',
              label: 'Logos',
              fields: [
                { name: 'nombre', type: 'text', label: 'Nombre' },
                { 
                  name: 'imagen', 
                  type: 'upload', 
                  relationTo: 'media',
                  label: 'Logo/Imagen',
                },
              ],
            },
          ],
        },
        {
          name: 'partners_publicitarios',
          type: 'group',
          label: 'Partners Publicitarios',
          fields: [
            { 
              name: 'titulo', 
              type: 'text', 
              label: 'Título de la Sección',
              defaultValue: 'Partners Publicitarios',
            },
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
            {
              name: 'logos',
              type: 'array',
              label: 'Logos',
              fields: [
                { name: 'nombre', type: 'text', label: 'Nombre' },
                { 
                  name: 'imagen', 
                  type: 'upload', 
                  relationTo: 'media',
                  label: 'Logo/Imagen',
                },
              ],
            },
          ],
        },
      ],
    },

    // ===== SERVICIOS =====
    {
      name: 'servicios_lista',
      type: 'array',
      label: 'Lista de Servicios',
      admin: {
        condition: (data) => data.seccion === 'servicios',
      },
      fields: [
        { name: 'servicio', type: 'textarea', label: 'Servicio' },
      ],
    },

    // ===== TESTIMONIOS (para Comunidad) =====
    {
      name: 'testimonios',
      type: 'array',
      label: 'Testimonios',
      admin: {
        condition: (data) => data.seccion === 'comunidad',
      },
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
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
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
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
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
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
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
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
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
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
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
      admin: {
        condition: (data) => data.seccion === 'contacto',
      },
      fields: [
        { name: 'campo', type: 'text', label: 'Nombre del Campo' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email de Contacto',
      admin: {
        condition: (data) => data.seccion === 'contacto',
      },
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
      admin: {
        condition: (data) => data.seccion === 'contacto',
      },
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
