import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Endpoint para crear UN documento de prueba directamente con Payload
 * Esto asegura que use el formato correcto que Payload espera
 */
export async function POST() {
  try {
    const payload = await getPayload({ config })

    console.log('\n🗑️  Limpiando documentos existentes...')
    
    // Eliminar todos los documentos primero
    const existing = await payload.find({
      collection: 'contenido-blog',
      limit: 100,
    })
    
    for (const doc of existing.docs) {
      await payload.delete({
        collection: 'contenido-blog',
        id: doc.id,
      })
    }
    console.log(`✅ Eliminados: ${existing.docs.length} documentos`)

    console.log('\n📝 Creando documentos con Payload API...')

    // INICIO
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'inicio',
        titulo: 'Creamos experiencias, gestionamos momentos.',
        descripcion: 'En RedTickets acompañamos a productores, artistas y marcas a conectar con su público.',
        estadisticas: {
          transacciones: 4000000,
          eventos_realizados: 20000,
          productores: 500,
        },
      },
    })
    console.log('✅ Inicio creado')

    // SOBRE NOSOTROS
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'sobre_nosotros',
        titulo: 'Más que una ticketera.',
        descripcion: 'Nos gusta festejar, reunirnos, emocionarnos. Desde 2015 trabajamos para que cada evento sea una experiencia fluida, segura y memorable.',
        fundadores: [
          { nombre: 'Sebastián Pérez Volpe', cargo: 'Máster en Marketing Digital' },
          { nombre: 'Carlos Fleurquin', cargo: 'Licenciado en Administración y emprendedor' },
          { nombre: 'Rafael Ordoñez', cargo: 'Director Creativo y Diseñador Senior' },
          { nombre: 'Bernardo Ponce de León', cargo: 'Contador Público y CFO' },
        ],
        equipo: [
          { nombre: 'Dani', area: 'Desarrollo' },
          { nombre: 'Fabri', area: 'Programación' },
          { nombre: 'Rochi', area: 'Comercial' },
          { nombre: 'Sofi', area: 'Comercial' },
          { nombre: 'Fran', area: 'Comercial' },
          { nombre: 'Emi', area: 'Desarrollo' },
          { nombre: 'Cami', area: 'Marketing' },
          { nombre: 'Marchu', area: 'Administración' },
          { nombre: 'Vale', area: 'Comercial' },
          { nombre: 'Fede', area: 'Atención al cliente' },
          { nombre: 'Cami', area: 'Administración', detalle: '' },
          { nombre: 'Lolo', area: 'Comercial', detalle: '' },
          { nombre: 'Agus', area: 'Atención al cliente', detalle: '' },
          { nombre: 'Fabi', area: 'Atención al cliente', detalle: '' },
        ],
      },
    })
    console.log('✅ Sobre Nosotros creado')

    // SERVICIOS
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'servicios',
        titulo: 'Nuestros Servicios',
        descripcion: 'Soluciones integrales para eventos de todo tipo.',
        servicios_lista: [
          { servicio: 'Venta y gestión de entradas' },
          { servicio: 'Compra de entradas con múltiples medios de pago' },
          { servicio: 'APP RedTickets' },
          { servicio: 'Diseño de e-ticket personalizado' },
          { servicio: 'Hard Ticketing' },
          { servicio: 'Control de acceso' },
          { servicio: 'Configuración avanzada' },
          { servicio: 'Integración con sistemas de acceso' },
          { servicio: 'Atención al cliente 7 días' },
          { servicio: 'Ticket Seguro (MetLife)' },
          { servicio: 'Sistema de acreditaciones' },
        ],
      },
    })
    console.log('✅ Servicios creado')

    // COMUNIDAD
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'comunidad',
        titulo: 'Nuestra Comunidad',
        descripcion: 'Lo mejor de RedTickets está en quienes confían en nosotros.',
        testimonios: [
          {
            texto: 'La atención fue impecable y la plataforma nos permitió vender entradas sin complicaciones.',
            autor: 'Festival Independiente Montevideo',
          },
        ],
      },
    })
    console.log('✅ Comunidad creado')

    // AYUDA
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'ayuda',
        titulo: '¿Tenés dudas? Estamos para ayudarte.',
        descripcion: 'Preguntas frecuentes sobre cómo comprar y vender tickets.',
        como_comprar: {
          introduccion: 'Comprar tus tickets es muy fácil en RedTickets.',
          pasos: [
            { titulo: 'Paso 1', detalle: 'Seleccionar el evento en redtickets.uy' },
            { titulo: 'Paso 2', detalle: 'Determinar cantidad y tipo de tickets' },
            { titulo: 'Paso 3', detalle: 'Seleccionar medio de pago' },
            { titulo: 'Paso 4', detalle: 'Recibir tickets por email' },
          ],
        },
        recepcion_tickets: {
          descripcion: 'Recibirás un PDF por cada entrada.',
          instrucciones: [
            { paso: 'Iniciá sesión en tu cuenta' },
            { paso: 'Hacé clic en tu nombre' },
            { paso: 'Entrá a Mis Tickets' },
            { paso: 'Descargá o imprimí' },
          ],
        },
        como_vender: {
          introduccion: 'Plataforma completa para gestionar ventas.',
          pasos: [
            { titulo: 'Paso 1', detalle: 'Crear evento en redtickets.net' },
            { titulo: 'Paso 2', detalle: 'Promocionar con URL única' },
            { titulo: 'Paso 3', detalle: 'Seguir ventas en tiempo real' },
            { titulo: 'Paso 4', detalle: 'Controlar acceso con app' },
            { titulo: 'Paso 5', detalle: 'Recibir liquidación' },
          ],
        },
        politicas: {
          cancelacion_eventos: 'La producción de cada evento es responsabilidad del organizador. Si un evento se cancela, se reintegrará el importe total de las entradas una vez que el organizador autorice la devolución. El reintegro se realiza por el mismo medio de pago utilizado o, si fue presencial, mediante transferencia bancaria. El proceso puede demorar entre 30 y 45 días hábiles. RedTickets comunicará por correo electrónico el procedimiento correspondiente.',
          reprogramacion: 'Si el evento cambia de fecha, se aplicará una tarifa administrativa de $80 por ticket. Si no podés asistir a la nueva fecha, podés solicitar la devolución escribiendo a hola@redtickets.uy.',
          imposibilidad_asistencia: 'Si no podés asistir a un evento, podés escribirnos a hola@redtickets.uy. La devolución dependerá de la autorización del organizador. Una vez aprobada, RedTickets gestionará el reembolso.',
        },
        ayuda_tecnica: {
          uso_totem: {
            descripcion: 'Los productores que utilizan los tótems de RedTickets pueden solicitar soporte técnico o materiales adicionales completando el formulario de asistencia.',
            video: 'Video Tutorial del tótem',
          },
          cambio_rollo: [
            { paso: 'Usar la llave plástica para abrir la impresora.' },
            { paso: 'Retirar el rollo vacío e insertar el nuevo con el rodamiento metálico.' },
            { paso: 'Extender el papel y cerrar la tapa correctamente.' },
          ],
          cancelar_compra_totem: {
            descripcion: 'Completá el formulario con los siguientes datos:',
            campos: [
              { campo: 'Lugar' },
              { campo: 'Correo del comprador' },
              { campo: 'ID de compra' },
              { campo: 'Motivo de la solicitud' },
            ],
          },
          solicitar_nuevos_rollos: 'Indicá la cantidad requerida a través del mismo formulario.',
        },
      },
    })
    console.log('✅ Ayuda creado')

    // CONTACTO
    await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'contacto',
        titulo: 'Contacto',
        descripcion: '¿Querés organizar un evento con RedTickets?',
        email: 'hola@redtickets.uy',
        telefono: '+598 94 636 018',
        formulario: [
          { campo: 'Nombre / Empresa' },
          { campo: 'Correo electrónico' },
          { campo: 'País' },
          { campo: 'Tipo de consulta' },
          { campo: 'Mensaje' },
        ],
      },
    })
    console.log('✅ Contacto creado')

    return NextResponse.json({
      success: true,
      message: '✅ 6 documentos creados correctamente con Payload API',
      instrucciones: [
        '1. Recargá el Admin Panel (Cmd+R)',
        '2. Ve a "Secciones"',
        '3. Deberías ver los 6 documentos',
        '4. Recargá el frontend (F5)',
      ],
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error:', errorMessage)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
