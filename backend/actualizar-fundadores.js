/**
 * Script para actualizar la sección "Sobre Nosotros" con la nueva estructura de fundadores
 * Ejecutar con: node actualizar-fundadores.js
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URI
const dbName = 'blog-headless'

async function actualizarFundadores() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Conectado a MongoDB')

    const db = client.db(dbName)
    const collection = db.collection('contenido-blog')

    // Datos de los fundadores (ajusta estos datos según corresponda)
    const fundadores = [
      { nombre: 'Nombre Fundador 1', cargo: 'Cargo/Puesto' },
      { nombre: 'Nombre Fundador 2', cargo: 'Cargo/Puesto' },
      { nombre: 'Nombre Fundador 3', cargo: 'Cargo/Puesto' },
      { nombre: 'Nombre Fundador 4', cargo: 'Cargo/Puesto' },
    ]

    // Buscar el documento de "sobre_nosotros"
    const sobreNosotros = await collection.findOne({ seccion: 'sobre_nosotros' })

    if (!sobreNosotros) {
      console.log('⚠️  No se encontró la sección sobre_nosotros')
      return
    }

    console.log('📝 Documento encontrado:', sobreNosotros.titulo)

    // Actualizar solo el array de fundadores (sin foto por ahora)
    const resultado = await collection.updateOne(
      { seccion: 'sobre_nosotros' },
      {
        $set: {
          fundadores: fundadores,
          // fundadores_foto: se debe agregar manualmente desde el Admin Panel
        },
        $unset: {
          // Eliminar el campo imagen de fundadores si existe
          'fundadores.$[].imagen': '',
        },
      }
    )

    console.log('✅ Fundadores actualizados:', resultado.modifiedCount, 'documento(s)')
    console.log('')
    console.log('📸 PRÓXIMOS PASOS:')
    console.log('1. Copia la foto de fundadores a backend/media/')
    console.log('   Ejemplo: cp ~/Downloads/fundadores.jpg backend/media/FUNDADORES.jpg')
    console.log('')
    console.log('2. Ve al Admin Panel: http://localhost:3000/admin')
    console.log('3. Edita la sección "Sobre Nosotros"')
    console.log('4. Sube la foto grupal en el campo "Foto Grupal de Fundadores"')
    console.log('5. Actualiza los nombres y cargos de los fundadores')
    console.log('')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    console.log('👋 Conexión cerrada')
  }
}

actualizarFundadores()
