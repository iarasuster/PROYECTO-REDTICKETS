/**
 * Endpoint para cargar el contenido inicial del blog
 * 
 * POST /api/seed-contenido
 * 
 * Este endpoint lee contenido_blog_redtickets.json y carga los datos en MongoDB
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Transforma arrays de strings a arrays de objetos según el formato de Payload
 */
function transformarArrays(obj: any, nombreSeccion: string): any {
  if (!obj || typeof obj !== 'object') return obj

  const resultado: any = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      // Transformar arrays de strings a arrays de objetos
      if (key === 'notas') {
        resultado[key] = value.map((item: any) => 
          typeof item === 'string' ? { nota: item } : item
        )
      } else if (key === 'principales') {
        resultado[key] = value.map((item: any) => 
          typeof item === 'string' ? { servicio: item } : item
        )
      } else if (key === 'instrucciones' || key === 'cambio_rollo') {
        resultado[key] = value.map((item: any) => 
          typeof item === 'string' ? { paso: item } : item
        )
      } else if (key === 'formulario' || key === 'campos') {
        resultado[key] = value.map((item: any) => 
          typeof item === 'string' ? { campo: item } : item
        )
      } else {
        // Para otros arrays, intentar transformar recursivamente
        resultado[key] = value.map((item: any) => transformarArrays(item, nombreSeccion))
      }
    } else if (value && typeof value === 'object') {
      // Recursivamente transformar objetos anidados
      resultado[key] = transformarArrays(value, nombreSeccion)
    } else {
      resultado[key] = value
    }
  }

  return resultado
}

export async function POST(_req: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de contenido del blog...\n')

    const payload = await getPayload({ config })
    console.log('✅ Payload inicializado correctamente\n')

    // Leer el archivo JSON
    const jsonPath = path.join(process.cwd(), 'contenido_blog_redtickets.json')
    
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({
        error: 'Archivo contenido_blog_redtickets.json no encontrado',
        path: jsonPath
      }, { status: 404 })
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8')
    const contenidoData = JSON.parse(rawData)

    console.log('📖 Archivo JSON leído correctamente\n')

    // Mapeo de nombres de secciones
    const seccionesMap: Record<string, 'inicio' | 'sobre_nosotros' | 'servicios' | 'comunidad' | 'ayuda' | 'contacto'> = {
      inicio: 'inicio',
      sobre_nosotros: 'sobre_nosotros',
      servicios: 'servicios',
      comunidad: 'comunidad',
      ayuda: 'ayuda',
      contacto: 'contacto',
    }

    let insertados = 0
    let actualizados = 0
    const errores: string[] = []

    // Procesar cada sección
    for (const [nombreSeccion, slug] of Object.entries(seccionesMap)) {
      try {
        console.log(`📝 Procesando sección: ${nombreSeccion}...`)

        const datosSeccion = contenidoData[nombreSeccion]

        if (!datosSeccion) {
          console.log(`⚠️  No se encontraron datos para ${nombreSeccion}, saltando...\n`)
          continue
        }

        // Transformar arrays de strings a objetos
        const datosTransformados = transformarArrays(datosSeccion, nombreSeccion)

        // Verificar si ya existe la sección
        const existente = await payload.find({
          collection: 'contenido-blog' as any,
          where: {
            seccion: {
              equals: slug,
            },
          },
        })

        // Preparar el documento
        const documento: any = {
          seccion: slug,
          [nombreSeccion]: datosTransformados,
        }

        if (existente.totalDocs > 0) {
          // Actualizar el documento existente
          await payload.update({
            collection: 'contenido-blog' as any,
            id: existente.docs[0].id,
            data: documento,
          })
          console.log(`✅ Sección "${nombreSeccion}" actualizada\n`)
          actualizados++
        } else {
          // Crear nuevo documento
          await payload.create({
            collection: 'contenido-blog' as any,
            data: documento,
          })
          console.log(`✅ Sección "${nombreSeccion}" insertada\n`)
          insertados++
        }
      } catch (error) {
        const errorMsg = `Error procesando ${nombreSeccion}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`❌ ${errorMsg}`)
        errores.push(errorMsg)
      }
    }

    // Respuesta final
    return NextResponse.json({
      success: true,
      message: '✅ Seed completado exitosamente',
      resultados: {
        insertados,
        actualizados,
        errores: errores.length,
        detalleErrores: errores,
      },
      acceso: {
        api_rest: '/api/contenido-blog',
        por_seccion: '/api/contenido-blog?where[seccion][equals]=inicio',
        graphql: '/api/graphql',
        admin_panel: '/admin → Contenido del Sitio → ContenidoBlog',
      }
    })

  } catch (error) {
    console.error('\n❌ Error fatal durante el seed:', error)
    return NextResponse.json({
      error: 'Error durante el seed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Método GET para instrucciones
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/seed-contenido',
    method: 'POST',
    descripcion: 'Carga el contenido inicial del blog desde contenido_blog_redtickets.json',
    uso: 'Envía un POST a este endpoint para ejecutar el seed',
    ejemplo: 'curl -X POST http://localhost:3000/api/seed-contenido',
    nota: 'El seed NO elimina datos existentes, solo inserta o actualiza',
  })
}
