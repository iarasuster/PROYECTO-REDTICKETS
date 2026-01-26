// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { UploadApiResponse } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ContenidoBlog } from './collections/ContenidoBlog'
import { Comments } from './collections/Comments'
import { Formularios } from './collections/Formularios'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary adapter personalizado
const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({
    file,
    collection,
    data,
    req,
    clientUploadContext,
  }: Parameters<HandleUpload>[0]) {
    try {
      // Detectar si es SVG
      const isSVG = file.mimeType === 'image/svg+xml' || file.filename.toLowerCase().endsWith('.svg')
      
      // Upload usando upload_stream (recomendado para Payload)
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: isSVG ? 'raw' : 'auto', // SVG como 'raw', resto 'auto'
            public_id: `media/${file.filename.replace(/\.[^/.]+$/, '')}`,
            overwrite: false,
            use_filename: true,
            ...(isSVG && { format: 'svg' }), // Preservar formato SVG
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result returned from Cloudinary'))
            resolve(result)
          },
        )
        uploadStream.end(file.buffer)
      })

      // Actualizar metadata del archivo con la info de Cloudinary
      file.filename = uploadResult.public_id // "media/nombre_archivo"
      // Para SVG, el mimeType debe ser image/svg+xml
      if (uploadResult.format === 'svg') {
        file.mimeType = 'image/svg+xml'
      } else {
        file.mimeType = `image/${uploadResult.format}` // "image/jpg", "image/png"
      }
      file.filesize = uploadResult.bytes
      // Asignar width/height solo si existen en el objeto file
      if ('width' in file && typeof uploadResult.width === 'number') {
        (file as any).width = uploadResult.width
      }
      if ('height' in file && typeof uploadResult.height === 'number') {
        (file as any).height = uploadResult.height
      }
      // Guardar la URL de Cloudinary directamente en data
      data.url = uploadResult.secure_url
      console.log('✅ Uploaded to Cloudinary:', uploadResult.secure_url)
    } catch (err) {
      console.error('❌ Upload Error', err)
      throw err
    }
  },
  async handleDelete({ collection, doc, filename, req }: Parameters<HandleDelete>[0]) {
    try {
      // filename ya viene como "media/nombre_archivo"
      await cloudinary.uploader.destroy(filename)
      console.log('✅ Deleted from Cloudinary:', filename)
    } catch (error) {
      console.error('❌ Cloudinary Delete Error:', error)
    }
  },
  staticHandler() {
    return new Response('Not implemented', { status: 501 })
  },
})

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, ContenidoBlog, Comments, Formularios],
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
          adapter: cloudinaryAdapter,
          disableLocalStorage: true, // Solo Cloudinary, no guardar localmente
          generateFileURL: (args) => {
            const filename = args.filename;
            const doc = (args as any).doc || {};
            // Si el documento ya tiene URL guardada desde handleUpload, usarla
            if (doc.url && (doc.url.includes('cloudinary.com/image/upload/v') || doc.url.includes('cloudinary.com/raw/upload'))) {
              return doc.url;
            }
            // Detectar si es SVG por mimeType o extensión
            const isSVG = doc.mimeType === 'image/svg+xml' || filename.toLowerCase().endsWith('.svg');
            const resourceType = isSVG ? 'raw' : 'image';
            // Asegurar que filename tenga el prefijo media/
            const path = filename.startsWith('media/') ? filename : `media/${filename}`;
            // Construir URL correcta según resource_type
            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${path}`;
          },
        },
      },
    }),
  ],
})
