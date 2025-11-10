import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      console.log('🔍 Media Create - User:', user ? user.email : 'NO USER')
      return !!user
    },
    update: ({ req: { user } }) => {
      console.log('🔍 Media Update - User:', user ? user.email : 'NO USER')
      return !!user
    },
    delete: ({ req: { user } }) => {
      console.log('🔍 Media Delete - User:', user ? user.email : 'NO USER')
      return !!user
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
