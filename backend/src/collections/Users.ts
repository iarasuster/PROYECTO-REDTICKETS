import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Cualquiera puede leer usuarios (necesario para auth)
    read: () => true,
    // Solo usuarios autenticados pueden crear otros usuarios
    create: ({ req: { user } }) => {
      console.log('🔍 Users Create - User:', user ? user.email : 'NO USER')
      return !!user
    },
    // Solo usuarios autenticados pueden actualizar
    update: ({ req: { user } }) => {
      console.log('🔍 Users Update - User:', user ? user.email : 'NO USER')
      return !!user
    },
    // Solo usuarios autenticados pueden eliminar
    delete: ({ req: { user } }) => {
      console.log('🔍 Users Delete - User:', user ? user.email : 'NO USER')
      return !!user
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
