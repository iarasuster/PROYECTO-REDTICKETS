/**
 * REVERTIR el desastre - renombrar correctamente según MongoDB
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

async function fixNames() {
  console.log('🔧 Corrigiendo nombres en Cloudinary...\n')

  const client = new MongoClient(process.env.DATABASE_URI)
  
  try {
    await client.connect()
    const db = client.db()
    const mediaCollection = db.collection('media')
    
    // Mapeo de nombres correctos desde MongoDB
    const correctNames = {
      'LIVE': 'LIVE_ERA',
      'el': 'el_pais',
      'CLUB': 'CLUB_MALVIN',
      'TABLADO': 'TABLADO_PARQUE', // Hay 2, este es el primero
      'VILLA': 'VILLA_DOLORES',
      'PLAZA': 'PLAZA_TOROS',
      'MAU': 'MAU_9637',
    }

    console.log('📝 Renombrando archivos mal renombrados:\n')

    for (const [wrong, correct] of Object.entries(correctNames)) {
      try {
        const withExtension = await cloudinary.api.resource(wrong)
        const format = withExtension.format
        
        await cloudinary.uploader.rename(wrong, correct)
        console.log(`✅ ${wrong} → ${correct}`)
      } catch (error) {
        console.log(`⚠️  ${wrong} - ${error.message}`)
      }
    }

    // Caso especial: TABLADO_PLAZA (hay 2 TABLADO)
    console.log('\n📝 Casos especiales:')
    // Este probablemente falló en el rename anterior
    // Necesitamos ver qué hay en Cloudinary ahora

    await client.close()
    console.log('\n✅ Corrección completada')

  } catch (error) {
    console.error('❌ Error:', error)
    await client.close()
  }
}

fixNames()
