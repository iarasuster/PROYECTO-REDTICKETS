import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Preservar la URL de Cloudinary si ya existe en data
        // Esto evita que generateFileURL la sobrescriba
        if (operation === 'create' && data.url && data.url.includes('cloudinary.com')) {
          // URL ya viene de Cloudinary con versión, preservarla
          console.log('✅ Preserving Cloudinary URL:', data.url)
        }
        return data
      },
    ],
  },
}