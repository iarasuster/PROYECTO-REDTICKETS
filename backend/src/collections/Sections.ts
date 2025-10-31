import type { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'seccion', 'orden', 'publicado'],
    group: 'Contenido del Sitio',
    description: 'Contenido de las diferentes secciones del sitio web',
    listSearchableFields: ['titulo', 'seccion'],
  },
  labels: {
    singular: 'Contenido',
    plural: 'Contenidos',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título del Contenido',
    },
    {
      name: 'seccion',
      type: 'select',
      required: true,
      label: 'Sección del Sitio',
      options: [
        {
          label: 'Inicio',
          value: 'inicio',
        },
        {
          label: 'Sobre Nosotros',
          value: 'sobre-nosotros',
        },
        {
          label: 'Servicios',
          value: 'servicios',
        },
        {
          label: 'Comunidad',
          value: 'comunidad',
        },
        {
          label: 'Ayuda',
          value: 'ayuda',
        },
        {
          label: 'Contacto',
          value: 'contacto',
        },
        {
          label: 'Footer',
          value: 'footer',
        },
      ],
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Tipo de Contenido',
      options: [
        {
          label: 'Hero/Banner Principal',
          value: 'hero',
        },
        {
          label: 'Experiencias Destacadas',
          value: 'experiencias',
        },
        {
          label: 'Historia y Propósito',
          value: 'historia',
        },
        {
          label: 'Equipo y Valores',
          value: 'equipo',
        },
        {
          label: 'Servicio/Funcionalidad',
          value: 'servicio',
        },
        {
          label: 'Guía Paso a Paso',
          value: 'guia',
        },
        {
          label: 'Testimonio',
          value: 'testimonio',
        },
        {
          label: 'Noticia/Novedad',
          value: 'noticia',
        },
        {
          label: 'Pregunta Frecuente',
          value: 'faq',
        },
        {
          label: 'Tutorial',
          value: 'tutorial',
        },
        {
          label: 'Política/Condición',
          value: 'politica',
        },
        {
          label: 'Información de Contacto',
          value: 'contacto',
        },
        {
          label: 'Formulario',
          value: 'formulario',
        },
      ],
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      label: 'Contenido',
    },
    {
      name: 'subtitulo',
      type: 'text',
      required: false,
      label: 'Subtítulo',
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Imagen',
    },
    {
      name: 'enlace',
      type: 'text',
      required: false,
      label: 'Enlace (URL)',
      admin: {
        description: 'Para botones o enlaces',
      },
    },
    {
      name: 'textoEnlace',
      type: 'text',
      required: false,
      label: 'Texto del Enlace',
      admin: {
        description: 'Texto que aparece en el botón/enlace',
      },
    },
    {
      name: 'orden',
      type: 'number',
      required: true,
      defaultValue: 1,
      label: 'Orden de Aparición',
      admin: {
        description: 'Número que determina el orden en que aparece el contenido',
      },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publicado',
      admin: {
        description: 'Marcar para hacer visible en el frontend',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Metadatos Adicionales',
      fields: [
        {
          name: 'autor',
          type: 'text',
          label: 'Autor (para testimonios)',
        },
        {
          name: 'cargo',
          type: 'text',
          label: 'Cargo/Empresa (para testimonios)',
        },
        {
          name: 'calificacion',
          type: 'number',
          label: 'Calificación (1-5)',
          min: 1,
          max: 5,
        },
      ],
    },
  ],
}