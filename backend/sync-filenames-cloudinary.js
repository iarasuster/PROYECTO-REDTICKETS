/**
 * Script para sincronizar filenames de MongoDB con public_ids de Cloudinary
 * Cloudinary agrega sufijos únicos (FEDERICA → FEDERICA_pciadl)
 */

import { v2 as cloudinary } from 'cloudinary'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function syncFilenames() {
  console.log('🔄 Sincronizando filenames con Cloudinary...\n')

  const client = new MongoClient(process.env.DATABASE_URI)
  
  try {
    // Obtener todas las imágenes de Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    })

    console.log(`✅ ${result.resources.length} imágenes en Cloudinary\n`)

    // Crear mapa: nombre_base → public_id_completo
    const cloudinaryMap = {}
    result.resources.forEach(resource => {
      const publicId = resource.public_id
      const format = resource.format
      const url = resource.secure_url
      
      // Extraer nombre base (sin sufijo)
      // FEDERICA_pciadl → FEDERICA
      const baseName = publicId.split('_')[0]
      
      // Guardar: "FEDERICA.jpg" → { publicId: "FEDERICA_pciadl", format: "jpg", url: "..." }
      const fullName = `${baseName}.${format}`
      cloudinaryMap[fullName.toUpperCase()] = {
        publicId,
        format,
        url,
        fullFilename: `${publicId}.${format}` // FEDERICA_pciadl.jpg
      }
    })

    // Conectar a MongoDB
    await client.connect()
    const db = client.db()
    const mediaCollection = db.collection('media')

    // Obtener todos los registros
    const mediaFiles = await mediaCollection.find({}).toArray()
    
    let updated = 0
    let skipped = 0

    for (const media of mediaFiles) {
      const currentFilename = media.filename
      const key = currentFilename.toUpperCase()
      
      const cloudinaryData = cloudinaryMap[key]
      
      if (cloudinaryData) {
        // Actualizar filename Y url
        await mediaCollection.updateOne(
          { _id: media._id },
          { 
            $set: { 
              filename: cloudinaryData.fullFilename, // FEDERICA_pciadl.jpg
              url: cloudinaryData.url, // URL completa de Cloudinary
              updatedAt: new Date()
            } 
          }
        )
        console.log(`✅ ${currentFilename} → ${cloudinaryData.fullFilename}`)
        updated++
      } else {
        console.log(`⏭️  ${currentFilename} - No encontrado en Cloudinary`)
        skipped++
      }
    }

    console.log('\n📊 Resumen:')
    console.log(`✅ Actualizados: ${updated}`)
    console.log(`⏭️  Saltados: ${skipped}`)
    console.log(`📸 Total: ${mediaFiles.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

syncFilenames()
