import { NextResponse } from 'next/server'
import payload from 'payload'

/**
 * Endpoint para cargar datos desde el JSON original
 * POST /api/cargar-json
 */
export async function POST() {
  try {
    // Datos del JSON original
    const contenidoCompleto = {
      inicio: {
        titulo: "Creamos experiencias, gestionamos momentos.",
        descripcion: "En RedTickets acompañamos a productores, artistas y marcas a conectar con su público. Este espacio es nuestra vitrina: una selección de los proyectos, alianzas y eventos que hicimos posibles.",
        estadisticas: {
          transacciones: 4000000,
          eventos_realizados: 20000,
          productores: 500
        },
      },
      sobre_nosotros: {
        titulo: "Más que una ticketera.",
        descripcion: "Nos gusta festejar, reunirnos, emocionarnos. Desde 2015 trabajamos para que cada evento sea una experiencia fluida, segura y memorable. En RedTickets combinamos tecnología, diseño y acompañamiento humano para que organizadores y asistentes disfruten cada etapa con confianza.",
        fundadores: [
          {
            nombre: "Sebastián Pérez Volpe",
            cargo: "Máster en Marketing Digital"
          },
          {
            nombre: "Carlos Fleurquin",
            cargo: "Licenciado en Administración y emprendedor"
          },
          {
            nombre: "Rafael Ordoñez",
            cargo: "Director Creativo y Diseñador Senior"
          },
          {
            nombre: "Bernardo Ponce de León",
            cargo: "Contador Público y CFO"
          }
        ],
        equipo: [
          { nombre: "Dani", area: "Desarrollo" },
          { nombre: "Fabri", area: "Programación" },
          { nombre: "Rochi", area: "Comercial" },
          { nombre: "Sofi", area: "Comercial" },
          { nombre: "Fran", area: "Comercial" },
          { nombre: "Emi", area: "Desarrollo" },
          { nombre: "Cami", area: "Marketing" },
          { nombre: "Marchu", area: "Administración" },
          { nombre: "Vale", area: "Comercial" },
          { nombre: "Fede", area: "Atención al cliente" },
          { nombre: "Cami", area: "Administración" },
          { nombre: "Lolo", area: "Comercial" },
          { nombre: "Agus", area: "Atención al cliente" },
          { nombre: "Fabi", area: "Atención al cliente" }
        ],
      },
      servicios: {
        descripcion: "Soluciones integrales para eventos de todo tipo. Ofrecemos acompañamiento personalizado y herramientas flexibles para productores, marcas y artistas.",
        servicios_lista: [
          { servicio: "Venta y gestión de entradas: crear, vender, controlar y liquidar." },
          { servicio: "Compra de entradas: múltiples medios de pago, tanto locales como internacionales." },
          { servicio: "APP RedTickets: permite comprar tickets, acceder a la billetera y recibir notificaciones." },
          { servicio: "Diseño de e-ticket personalizado." },
          { servicio: "Hard Ticketing: impresión y suministro de entradas físicas." },
          { servicio: "Control de acceso: personal capacitado, software propio y aplicación ControlTickets (Android/iOS)." },
          { servicio: "Configuración avanzada: descuentos, promociones, códigos de acceso y límites de compra." },
          { servicio: "Integración con sistemas de control de acceso (como molinos de seguridad)." },
          { servicio: "Atención al cliente los 7 días de la semana." },
          { servicio: "Ticket Seguro (MetLife): seguro asociado a las entradas." },
          { servicio: "Sistema propio de acreditaciones: etiquetas personalizadas y credenciales." }
        ],
      },
      comunidad: {
        descripcion: "Lo mejor de RedTickets está en quienes confían en nosotros. Cada evento cuenta una historia.",
        testimonios: [
          {
            texto: "La atención fue impecable y la plataforma nos permitió vender entradas sin complicaciones.",
            autor: "Festival Independiente Montevideo"
          }
        ],
      },
      ayuda: {
        titulo: "¿Tenés dudas? Estamos para ayudarte.",
        descripcion: "Preguntas frecuentes sobre cómo comprar y vender tickets.",
        como_comprar: {
          introduccion: "Comprar tus tickets es muy fácil en RedTickets. No hay colas ni esperas, y podés pagar con tu medio de pago preferido. Solo guardás el código y vas directo al evento.",
          pasos: [
            { titulo: "Paso 1", detalle: "Seleccionar el evento: Todos los eventos están en redtickets.uy" },
            { titulo: "Paso 2", detalle: "Determinar cantidad y tipo de tickets según disponibilidad" },
            { titulo: "Paso 3", detalle: "Seleccionar medio de pago (online o presencial)" },
            { titulo: "Paso 4", detalle: "Finalizar transacción y recibir tickets por email" }
          ]
        },
        recepcion_tickets: {
          descripcion: "Cuando la compra se confirme, recibirás un correo electrónico con un archivo PDF por cada entrada.",
          instrucciones: [
            { paso: "Iniciá sesión con tu usuario y contraseña" },
            { paso: "En el menú superior, hacé clic en tu nombre" },
            { paso: "Entrá a 'Mis Tickets' para ver todas tus entradas" },
            { paso: "Podés descargarlas, imprimirlas o guardarlas en tu teléfono" }
          ]
        },
        como_vender: {
          introduccion: "Si organizás eventos, RedTickets te ofrece una plataforma completa para gestionar ventas, controlar accesos y recibir asistencia personalizada.",
          pasos: [
            { titulo: "Paso 1", detalle: "Crear y registrar tu evento en redtickets.net" },
            { titulo: "Paso 2", detalle: "Promocionar tu evento con URL única" },
            { titulo: "Paso 3", detalle: "Seguir tus ventas en tiempo real" },
            { titulo: "Paso 4", detalle: "Controlar el acceso con app ControlTickets" },
            { titulo: "Paso 5", detalle: "Recibir liquidación final post-evento" }
          ]
        },
      },
      contacto: {
        descripcion: "¿Querés organizar un evento con RedTickets o recibir más información sobre nuestros servicios?",
        email: "hola@redtickets.uy",
        telefono: "+598 94 636 018",
        formulario: [
          { campo: "Nombre / Empresa" },
          { campo: "Correo electrónico" },
          { campo: "País" },
          { campo: "Tipo de consulta" },
          { campo: "Mensaje" }
        ],
      }
    }

    console.log('\n🗑️  Eliminando documentos existentes...')
    const deleteResult = await payload.delete({
      collection: 'contenido-blog',
      where: {},
    })
    console.log(`✅ Eliminados: ${deleteResult.docs.length} documentos`)

    console.log('\n📝 Cargando datos desde JSON...')
    const resultados = []

    // INICIO
    const inicio = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'inicio',
        titulo: contenidoCompleto.inicio.titulo,
        descripcion: contenidoCompleto.inicio.descripcion,
        estadisticas: contenidoCompleto.inicio.estadisticas,
      },
    })
    resultados.push({ seccion: 'inicio', id: inicio.id })

    // SOBRE NOSOTROS
    const sobreNosotros = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'sobre_nosotros',
        titulo: contenidoCompleto.sobre_nosotros.titulo,
        descripcion: contenidoCompleto.sobre_nosotros.descripcion,
        fundadores: contenidoCompleto.sobre_nosotros.fundadores,
        equipo: contenidoCompleto.sobre_nosotros.equipo,
      },
    })
    resultados.push({ seccion: 'sobre_nosotros', id: sobreNosotros.id, fundadores: sobreNosotros.fundadores?.length, equipo: sobreNosotros.equipo?.length })

    // SERVICIOS
    const servicios = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'servicios',
        titulo: 'Nuestros Servicios',
        descripcion: contenidoCompleto.servicios.descripcion,
        servicios_lista: contenidoCompleto.servicios.servicios_lista,
      },
    })
    resultados.push({ seccion: 'servicios', id: servicios.id, servicios: servicios.servicios_lista?.length })

    // COMUNIDAD
    const comunidad = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'comunidad',
        titulo: 'Nuestra Comunidad',
        descripcion: contenidoCompleto.comunidad.descripcion,
        testimonios: contenidoCompleto.comunidad.testimonios,
      },
    })
    resultados.push({ seccion: 'comunidad', id: comunidad.id, testimonios: comunidad.testimonios?.length })

    // AYUDA
    const ayuda = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'ayuda',
        titulo: contenidoCompleto.ayuda.titulo,
        descripcion: contenidoCompleto.ayuda.descripcion,
        como_comprar: contenidoCompleto.ayuda.como_comprar,
        recepcion_tickets: contenidoCompleto.ayuda.recepcion_tickets,
        como_vender: contenidoCompleto.ayuda.como_vender,
      },
    })
    resultados.push({ seccion: 'ayuda', id: ayuda.id })

    // CONTACTO
    const contacto = await payload.create({
      collection: 'contenido-blog',
      data: {
        seccion: 'contacto',
        titulo: 'Contacto',
        descripcion: contenidoCompleto.contacto.descripcion,
        email: contenidoCompleto.contacto.email,
        telefono: contenidoCompleto.contacto.telefono,
        formulario: contenidoCompleto.contacto.formulario,
      },
    })
    resultados.push({ seccion: 'contacto', id: contacto.id })

    console.log('✅ Todos los documentos creados')

    return NextResponse.json({
      success: true,
      message: '✅ Datos cargados correctamente desde el JSON original',
      eliminados: deleteResult.docs.length,
      creados: resultados,
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
