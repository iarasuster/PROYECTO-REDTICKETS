/**
 * Renombrar archivos en Cloudinary para quitar sufijos
 * FEDERICA_pciadl → FEDERICA
 */

import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function renameInCloudinary() {
  console.log('🔄 Renombrando archivos en Cloudinary...\n')

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    })

    console.log(`✅ ${result.resources.length} imágenes encontradas\n`)

    let renamed = 0
    let skipped = 0

    for (const resource of result.resources) {
      const currentPublicId = resource.public_id
      const format = resource.format
      
      // Si ya es un nombre limpio (sin _), skip
      if (!currentPublicId.includes('_')) {
        console.log(`⏭️  ${currentPublicId} - Ya está limpio`)
        skipped++
        continue
      }

      // Extraer nombre base (sin sufijo)
      const baseName = currentPublicId.split('_')[0]
      const newPublicId = baseName

      try {
        // Renombrar en Cloudinary
        await cloudinary.uploader.rename(currentPublicId, newPublicId)
        console.log(`✅ ${currentPublicId} → ${newPublicId}`)
        renamed++
      } catch (error) {
        console.log(`❌ Error renombrando ${currentPublicId}:`, error.message)
      }
    }

    console.log('\n📊 Resumen:')
    console.log(`✅ Renombrados: ${renamed}`)
    console.log(`⏭️  Saltados: ${skipped}`)
    console.log(`📸 Total: ${result.resources.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

renameInCloudinary()
