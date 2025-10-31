// Script temporal para limpiar la colección sections
import { MongoClient } from 'mongodb'

const uri =
  'mongodb+srv://iarasuster_db_user:tZrCml2jJMkSYdxL@cluster0.hlsufca.mongodb.net/blog-headless'

async function cleanup() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Conectado a MongoDB')

    const db = client.db('blog-headless')
    const sections = db.collection('sections')

    // Contar documentos antes
    const countBefore = await sections.countDocuments()
    console.log(`📊 Documentos antes: ${countBefore}`)

    // Eliminar TODOS los documentos
    const result = await sections.deleteMany({})
    console.log(`🗑️  Documentos eliminados: ${result.deletedCount}`)

    // Contar documentos después
    const countAfter = await sections.countDocuments()
    console.log(`📊 Documentos después: ${countAfter}`)

    console.log('✅ Limpieza completada. Ahora puedes crear contenido nuevo desde el admin.')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

cleanup()
