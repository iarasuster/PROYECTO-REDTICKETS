import type { CollectionConfig } from 'payload'

export const Formularios: CollectionConfig = {
  slug: 'formularios',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['tipo', 'email', 'createdAt', 'estado'],
    description: 'Recopilación de datos de newsletter, ayuda técnica y contacto',
  },
  access: {
    create: () => true, // Público puede crear
    read: ({ req: { user } }) => !!user, // Solo admin puede leer
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo de Formulario',
      required: true,
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Ayuda Técnica Totem', value: 'ayuda_totem' },
        { label: 'Contacto General', value: 'contacto' },
      ],
      defaultValue: 'newsletter',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      index: true,
    },
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      admin: {
        condition: (data) => data.tipo !== 'newsletter',
      },
    },
    {
      name: 'mensaje',
      type: 'textarea',
      label: 'Mensaje',
      admin: {
        condition: (data) => data.tipo !== 'newsletter',
      },
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
      admin: {
        condition: (data) => data.tipo === 'ayuda_totem',
      },
    },
    {
      name: 'ubicacion_totem',
      type: 'text',
      label: 'Ubicación del Totem',
      admin: {
        condition: (data) => data.tipo === 'ayuda_totem',
      },
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'En Proceso', value: 'en_proceso' },
        { label: 'Resuelto', value: 'resuelto' },
      ],
      defaultValue: 'pendiente',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
