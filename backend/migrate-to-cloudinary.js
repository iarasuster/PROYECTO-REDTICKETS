/**
 * Script de migración de URLs de imágenes locales a Cloudinary
 * 
 * NOTA: Las imágenes ya fueron subidas manualmente a Cloudinary.
 * Este script solo actualiza las URLs en MongoDB.
 * 
 * USO:
 * 1. Asegúrate de tener las credenciales de Cloudinary en .env
 * 2. npm run dev (en otra terminal)
 * 3. node migrate-to-cloudinary.js
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

async function migrateURLs() {
  console.log('🚀 Iniciando actualización de URLs a Cloudinary...\n')

  const client = new MongoClient(process.env.DATABASE_URI)

  try {
    await client.connect()
    console.log('✅ Conectado a MongoDB\n')

    const db = client.db()
    const mediaCollection = db.collection('media')

    // Obtener todos los registros de media
    const mediaFiles = await mediaCollection.find({}).toArray()
    console.log(`📸 Encontrados ${mediaFiles.length} registros de media\n`)

    let updated = 0
    let skipped = 0

    for (const mediaFile of mediaFiles) {
      try {
        // Si ya tiene URL de Cloudinary, skip
        if (mediaFile.url && mediaFile.url.includes('cloudinary.com')) {
          console.log(`⏭️  ${mediaFile.filename} - Ya tiene URL de Cloudinary`)
          skipped++
          continue
        }

        // Construir URL de Cloudinary basada en el filename
        // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const filename = mediaFile.filename
        const cloudinaryURL = `https://res.cloudinary.com/${cloudName}/image/upload/redtickets/${filename}`

        // Actualizar registro en MongoDB
        await mediaCollection.updateOne(
          { _id: mediaFile._id },
          { 
            $set: { 
              url: cloudinaryURL,
              updatedAt: new Date()
            } 
          }
        )

        console.log(`✅ ${filename}`)
        console.log(`   URL: ${cloudinaryURL}\n`)
        updated++

      } catch (error) {
        console.error(`❌ Error con ${mediaFile.filename}:`, error.message)
      }
    }

    console.log('\n📊 Resumen de migración:')
    console.log(`✅ Actualizadas: ${updated}`)
    console.log(`⏭️  Saltadas: ${skipped}`)
    console.log(`📸 Total: ${mediaFiles.length}`)

    if (updated > 0) {
      console.log('\n🎉 Migración completada!')
      console.log('💡 Verifica las imágenes en el admin panel: http://localhost:3000/admin/collections/media')
    }

  } catch (error) {
    console.error('❌ Error fatal:', error)
  } finally {
    await client.close()
    process.exit(0)
  }
}

// Ejecutar migración
migrateURLs()
