// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ContenidoBlog } from './collections/ContenidoBlog'
import { Comments } from './collections/Comments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, ContenidoBlog, Comments],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Configuración de CORS - Permitir todos los origenes (necesario para preview deployments dinámicos de Vercel)
  cors: '*',
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:4173',
    'https://blog-redtickets.vercel.app',
    'https://redtickets-backend.vercel.app',
    'https://redtickets-backend.onrender.com',
    'https://redtickets-frontend.onrender.com',
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: ({ prefix }) => ({
            name: 'cloudinary',
            handleUpload: async ({ file }) => {
              // Cloudinary requiere path o base64, no Buffer directo
              let uploadSource: string = file.tempFilePath || ''
              
              if (!uploadSource && file.buffer) {
                // Convertir buffer a base64 data URI
                const base64 = file.buffer.toString('base64')
                uploadSource = `data:${file.mimeType};base64,${base64}`
              }
              
              if (!uploadSource) {
                throw new Error('No file source available for upload')
              }
              
              const result = await cloudinary.uploader.upload(uploadSource, {
                folder: prefix || 'redtickets',
                resource_type: 'auto',
              })
              
              return {
                ...file,
                url: result.secure_url,
                filename: result.public_id,
              }
            },
            handleDelete: async ({ filename }) => {
              await cloudinary.uploader.destroy(filename)
            },
            staticHandler: (_req, _args) => {
              // Cloudinary maneja las URLs directamente, no necesitamos proxy
              return new Response('Not found', { status: 404 })
            },
          }),
          disablePayloadAccessControl: true, // URLs apuntan directo a Cloudinary
        },
      },
    }),
  ],
})
