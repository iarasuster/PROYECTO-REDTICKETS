// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  // Configuración de CORS para permitir acceso desde el frontend
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:4173',
    // Vercel deployments (todos los subdominios)
    'https://blog-redtickets.vercel.app',
    'https://redtickets-backend.vercel.app',
    /https:\/\/.*\.vercel\.app$/, // Regex para todos los preview deployments de Vercel
    // Render deployments
    'https://redtickets-backend.onrender.com',
    'https://redtickets-frontend.onrender.com',
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:4173',
    // Vercel deployments
    'https://blog-redtickets.vercel.app',
    'https://redtickets-backend.vercel.app',
    /https:\/\/.*\.vercel\.app$/, // Regex para todos los preview deployments
    // Render deployments
    'https://redtickets-backend.onrender.com',
    'https://redtickets-frontend.onrender.com',
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
