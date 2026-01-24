/**
 * Script para obtener URLs reales de Cloudinary y actualizar MongoDB
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

async function fixURLs() {
  console.log('🔍 Obteniendo imágenes de Cloudinary...\n')

  const client = new MongoClient(process.env.DATABASE_URI)
  
  try {
    // Primero buscar en TODAS las carpetas para ver qué hay
    console.log('📁 Buscando en todas las carpetas...\n')
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    })

    console.log(`✅ Encontradas ${allResources.resources.length} imágenes en total\n`)
    
    // Mostrar las primeras 10 para ver estructura
    console.log('📋 Primeras 10 imágenes encontradas:')
    allResources.resources.slice(0, 10).forEach(r => {
      console.log(`   ${r.public_id} → ${r.secure_url}`)
    })
    console.log('\n')

    // Buscar específicamente en carpeta redtickets/
    console.log('📁 Buscando en carpeta "redtickets/"...')
    const redticketsResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'redtickets/',
      max_results: 500,
    })
    console.log(`✅ En carpeta redtickets/: ${redticketsResult.resources.length} imágenes\n`)

    // Usar las que encontremos (primero redtickets/, sino todas)
    const result = redticketsResult.resources.length > 0 ? redticketsResult : allResources

    // Crear mapa: nombre_original → URL_cloudinary
    const urlMap = {}
    result.resources.forEach(resource => {
      // Extraer nombre base (sin carpeta ni sufijos de Cloudinary)
      // Ejemplo: "redtickets/ROCIO_s0ezjz" → buscar por "ROCIO"
      const publicId = resource.public_id.replace('redtickets/', '')
      const format = resource.format
      const secureUrl = resource.secure_url
      
      // Intentar matchear con nombres originales
      const baseName = publicId.split('_')[0] // "ROCIO_s0ezjz" → "ROCIO"
      const fullName = `${baseName}.${format}` // "ROCIO.jpg"
      
      urlMap[fullName] = secureUrl
      urlMap[publicId] = secureUrl // También guardar con sufijo
      
      console.log(`📸 ${fullName} → ${secureUrl}`)
    })

    console.log('\n🔄 Actualizando MongoDB...\n')

    // Conectar a MongoDB
    await client.connect()
    const db = client.db()
    const mediaCollection = db.collection('media')

    // Obtener todos los registros
    const mediaFiles = await mediaCollection.find({}).toArray()
    
    let updated = 0
    let notFound = 0

    for (const media of mediaFiles) {
      const filename = media.filename
      
      // Buscar URL en el mapa
      let cloudinaryURL = urlMap[filename] || urlMap[filename.toUpperCase()]
      
      // Si no encuentra exacto, buscar por nombre base
      if (!cloudinaryURL) {
        const baseName = filename.split('.')[0]
        const matches = Object.keys(urlMap).filter(key => 
          key.startsWith(baseName) || key.toUpperCase().startsWith(baseName.toUpperCase())
        )
        if (matches.length > 0) {
          cloudinaryURL = urlMap[matches[0]]
        }
      }

      if (cloudinaryURL) {
        await mediaCollection.updateOne(
          { _id: media._id },
          { $set: { url: cloudinaryURL, updatedAt: new Date() } }
        )
        console.log(`✅ ${filename} → actualizado`)
        updated++
      } else {
        console.log(`❌ ${filename} → NO encontrado en Cloudinary`)
        notFound++
      }
    }

    console.log('\n📊 Resumen:')
    console.log(`✅ Actualizadas: ${updated}`)
    console.log(`❌ No encontradas: ${notFound}`)
    console.log(`📸 Total: ${mediaFiles.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixURLs()
