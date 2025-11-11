import type { CollectionConfig } from 'payload'

/**
 * Colección ContenidoBlog
 * 
 * Esta colección almacena todo el contenido estructurado del sitio web de RedTickets
 * organizizado por secciones (inicio, sobre-nosotros, servicios, comunidad, ayuda, contacto).
 * 
 * El contenido se puede editar desde el panel de Payload en:
 * - Admin Panel → ContenidoBlog → [Editar documento]
 * 
 * Cada sección tiene su propio grupo de campos con la estructura específica del JSON original.
 */
export const ContenidoBlog: CollectionConfig = {
  slug: 'contenido-blog',
  admin: {
    useAsTitle: 'seccion',
    defaultColumns: ['seccion', 'updatedAt'],
    group: 'Contenido del Sitio',
    description: 'Contenido estructurado de todas las secciones del sitio web',
  },
  labels: {
    singular: 'Contenido Blog',
    plural: 'Contenido Blog',
  },
  access: {
    read: () => true, // Público para el frontend y chatbot
    create: ({ req: { user } }) => {
      console.log('🔍 ContenidoBlog Create - User:', user ? user.email : 'NO USER')
      return !!user
    },
    update: ({ req: { user } }) => {
      console.log('🔍 ContenidoBlog Update - User:', user ? user.email : 'NO USER')
      return !!user
    },
    delete: ({ req: { user } }) => {
      console.log('🔍 ContenidoBlog Delete - User:', user ? user.email : 'NO USER')
      return !!user
    },
  },
  fields: [
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
    
    // ========== INICIO ==========
    {
      name: 'inicio',
      type: 'group',
      label: 'Contenido de Inicio',
      admin: {
        condition: (data) => data.seccion === 'inicio',
      },
      fields: [
        { name: 'titulo', type: 'text', label: 'Título Principal' },
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
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
        { name: 'noticias', type: 'text', label: 'Noticias' },
      ],
    },

    // ========== SOBRE NOSOTROS ==========
    {
      name: 'sobre_nosotros',
      type: 'group',
      label: 'Contenido de Sobre Nosotros',
      admin: {
        condition: (data) => data.seccion === 'sobre_nosotros',
      },
      fields: [
        { name: 'titulo', type: 'text', label: 'Título' },
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
        {
          name: 'fundadores',
          type: 'array',
          label: 'Fundadores',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre' },
            { name: 'cargo', type: 'text', label: 'Cargo' },
          ],
        },
        {
          name: 'equipo',
          type: 'array',
          label: 'Equipo',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre' },
            { name: 'area', type: 'text', label: 'Área' },
            { name: 'detalle', type: 'textarea', label: 'Detalle', required: false },
          ],
        },
        {
          name: 'notas',
          type: 'array',
          label: 'Notas Internas',
          fields: [{ name: 'nota', type: 'text' }],
        },
      ],
    },

    // ========== SERVICIOS ==========
    {
      name: 'servicios',
      type: 'group',
      label: 'Contenido de Servicios',
      admin: {
        condition: (data) => data.seccion === 'servicios',
      },
      fields: [
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
        {
          name: 'principales',
          type: 'array',
          label: 'Servicios Principales',
          fields: [{ name: 'servicio', type: 'textarea' }],
        },
        {
          name: 'notas',
          type: 'array',
          label: 'Notas Internas',
          fields: [{ name: 'nota', type: 'text' }],
        },
      ],
    },

    // ========== COMUNIDAD ==========
    {
      name: 'comunidad',
      type: 'group',
      label: 'Contenido de Comunidad',
      admin: {
        condition: (data) => data.seccion === 'comunidad',
      },
      fields: [
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
        {
          name: 'testimonios',
          type: 'array',
          label: 'Testimonios',
          fields: [
            { name: 'texto', type: 'textarea', label: 'Texto del Testimonio' },
            { name: 'autor', type: 'text', label: 'Autor' },
          ],
        },
        {
          name: 'notas',
          type: 'array',
          label: 'Notas Internas',
          fields: [{ name: 'nota', type: 'text' }],
        },
      ],
    },

    // ========== AYUDA ==========
    {
      name: 'ayuda',
      type: 'group',
      label: 'Contenido de Ayuda',
      admin: {
        condition: (data) => data.seccion === 'ayuda',
      },
      fields: [
        { name: 'descripcion_general', type: 'textarea', label: 'Descripción General' },
        
        // Cómo Comprar
        {
          name: 'como_comprar',
          type: 'group',
          label: 'Cómo Comprar',
          fields: [
            { name: 'introduccion', type: 'textarea', label: 'Introducción' },
            { name: 'video', type: 'text', label: 'Video Tutorial' },
            {
              name: 'pasos',
              type: 'array',
              label: 'Pasos',
              fields: [
                { name: 'titulo', type: 'text', label: 'Título del Paso' },
                { name: 'detalle', type: 'textarea', label: 'Detalle' },
                { name: 'pagos_presenciales', type: 'textarea', label: 'Pagos Presenciales', required: false },
              ],
            },
          ],
        },

        // Recepción de Tickets
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
              fields: [{ name: 'paso', type: 'text' }],
            },
            { name: 'nota', type: 'textarea', label: 'Nota' },
            { name: 'asistencia', type: 'textarea', label: 'Asistencia' },
          ],
        },

        // Acceso al Evento
        {
          name: 'acceso_evento',
          type: 'group',
          label: 'Acceso al Evento',
          fields: [
            { name: 'descripcion', type: 'textarea', label: 'Descripción' },
          ],
        },

        // Cómo Vender
        {
          name: 'como_vender',
          type: 'group',
          label: 'Cómo Vender',
          fields: [
            { name: 'introduccion', type: 'textarea', label: 'Introducción' },
            { name: 'video', type: 'text', label: 'Video Tutorial' },
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

        // Políticas
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

        // Ayuda Técnica
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
              fields: [{ name: 'paso', type: 'text' }],
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
                  fields: [{ name: 'campo', type: 'text' }],
                },
              ],
            },
            { name: 'solicitar_nuevos_rollos', type: 'textarea', label: 'Solicitar Nuevos Rollos' },
          ],
        },
      ],
    },

    // ========== CONTACTO ==========
    {
      name: 'contacto',
      type: 'group',
      label: 'Contenido de Contacto',
      admin: {
        condition: (data) => data.seccion === 'contacto',
      },
      fields: [
        { name: 'descripcion', type: 'textarea', label: 'Descripción' },
        {
          name: 'formulario',
          type: 'array',
          label: 'Campos del Formulario',
          fields: [{ name: 'campo', type: 'text' }],
        },
        { name: 'email', type: 'email', label: 'Email de Contacto' },
        { name: 'telefono', type: 'text', label: 'Teléfono' },
        { name: 'nota', type: 'textarea', label: 'Nota Interna' },
      ],
    },
  ],
}
