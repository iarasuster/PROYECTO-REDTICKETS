/**
 * Script para cargar el contenido inicial del blog en MongoDB
 *
 * Este script lee el archivo contenido_blog_redtickets.json y carga cada sección
 * como un documento separado en la colección ContenidoBlog de Payload CMS.
 *
 * USO:
 * node seed-contenido.js
 *
 * o agregar a package.json:
 * "seed": "node seed-contenido.js"
 *
 * NOTA: El script NO elimina datos existentes, solo inserta o actualiza.
 */

import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seedContenido() {
  console.log('🌱 Iniciando seed de contenido del blog...\n')

  try {
    // Inicializar Payload sin config (usa el del entorno)
    const payload = await getPayload({
      config: await import('./src/payload.config.ts').then((m) => m.default),
    })
    console.log('✅ Payload inicializado correctamente\n')

    // Leer el archivo JSON
    const jsonPath = path.join(__dirname, 'contenido_blog_redtickets.json')
    const rawData = fs.readFileSync(jsonPath, 'utf8')
    const contenidoData = JSON.parse(rawData)

    console.log('📖 Archivo JSON leído correctamente\n')

    // Mapeo de nombres de secciones del JSON a slugs de Payload
    const seccionesMap = {
      inicio: 'inicio',
      sobre_nosotros: 'sobre_nosotros',
      servicios: 'servicios',
      comunidad: 'comunidad',
      ayuda: 'ayuda',
      contacto: 'contacto',
    }

    let insertados = 0
    let actualizados = 0
    let errores = 0

    // Procesar cada sección
    for (const [nombreSeccion, slug] of Object.entries(seccionesMap)) {
      try {
        console.log(`📝 Procesando sección: ${nombreSeccion}...`)

        const datosSeccion = contenidoData[nombreSeccion]

        if (!datosSeccion) {
          console.log(`⚠️  No se encontraron datos para ${nombreSeccion}, saltando...\n`)
          continue
        }

        // Verificar si ya existe la sección
        const existente = await payload.find({
          collection: 'contenido-blog',
          where: {
            seccion: {
              equals: slug,
            },
          },
        })

        // Preparar el documento
        const documento = {
          seccion: slug,
          [nombreSeccion]: datosSeccion,
        }

        if (existente.totalDocs > 0) {
          // Actualizar el documento existente
          await payload.update({
            collection: 'contenido-blog',
            id: existente.docs[0].id,
            data: documento,
          })
          console.log(`✅ Sección "${nombreSeccion}" actualizada\n`)
          actualizados++
        } else {
          // Crear nuevo documento
          await payload.create({
            collection: 'contenido-blog',
            data: documento,
          })
          console.log(`✅ Sección "${nombreSeccion}" insertada\n`)
          insertados++
        }
      } catch (error) {
        console.error(`❌ Error procesando sección ${nombreSeccion}:`, error.message)
        errores++
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(50))
    console.log('📊 RESUMEN DEL SEED')
    console.log('='.repeat(50))
    console.log(`✅ Documentos insertados: ${insertados}`)
    console.log(`🔄 Documentos actualizados: ${actualizados}`)
    console.log(`❌ Errores: ${errores}`)
    console.log('='.repeat(50))

    console.log('\n🎉 ¡Seed completado exitosamente!')
    console.log('\n📝 Para editar el contenido:')
    console.log('   1. Ve al Admin Panel de Payload')
    console.log('   2. Navega a: Contenido del Sitio → ContenidoBlog')
    console.log('   3. Selecciona la sección que desees editar')
    console.log('   4. Modifica los campos y guarda los cambios')

    console.log('\n🔗 Acceso a los datos:')
    console.log('   - API REST: GET /api/contenido-blog')
    console.log('   - Por sección: GET /api/contenido-blog?where[seccion][equals]=inicio')
    console.log('   - GraphQL: Disponible en /api/graphql')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error fatal durante el seed:', error)
    process.exit(1)
  }
}

// Ejecutar el seed
seedContenido()
