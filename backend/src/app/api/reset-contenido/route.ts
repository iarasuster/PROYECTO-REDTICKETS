import { NextResponse } from 'next/server'
import payload from 'payload'

/**
 * Endpoint para limpiar documentos antiguos y crear uno de prueba
 * POST /api/reset-contenido
 */
export async function POST() {
  try {
    console.log('\n🗑️  Eliminando documentos antiguos...')
    const deleteResult = await payload.delete({
      collection: 'contenido-blog',
      where: {},
    })
    console.log(`✅ Eliminados: ${deleteResult.docs.length} documentos`)

    console.log('\n📝 Creando documento de prueba para "Sobre Nosotros"...')
    const testDoc = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'sobre_nosotros',
        titulo: 'Sobre RedTickets',
        descripcion: 'Somos la plataforma líder de venta de tickets en Argentina.',
        estadisticas: {
          transacciones: 50000,
          eventos_realizados: 1200,
          productores: 350,
        },
        fundadores: [
          {
            nombre: 'Sebastián Pérez Volpe',
            cargo: 'CEO - Máster en Marketing Digital',
          },
          {
            nombre: 'Nicolás Fernández',
            cargo: 'CTO - Ingeniero en Sistemas',
          },
          {
            nombre: 'María González',
            cargo: 'CFO - Contadora Pública',
          },
          {
            nombre: 'Lucas Martínez',
            cargo: 'COO - Lic. en Administración',
          },
        ],
        equipo: [
          {
            nombre: 'Juan Pérez',
            area: 'Desarrollo',
          },
          {
            nombre: 'Ana López',
            area: 'Diseño',
          },
          {
            nombre: 'Carlos Rodríguez',
            area: 'Marketing',
          },
          {
            nombre: 'Laura Fernández',
            area: 'Soporte',
          },
          {
            nombre: 'Diego Martínez',
            area: 'Desarrollo',
          },
          {
            nombre: 'Sofía García',
            area: 'Ventas',
          },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: '✅ Documentos limpiados y documento de prueba creado',
      eliminados: deleteResult.docs.length,
      creado: {
        id: testDoc.id,
        seccion: testDoc.seccion,
        titulo: testDoc.titulo,
        fundadores: testDoc.fundadores?.length || 0,
        equipo: testDoc.equipo?.length || 0,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error:', errorMessage)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
