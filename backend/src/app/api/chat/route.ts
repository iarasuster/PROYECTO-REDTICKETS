import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getPayload } from 'payload'
import config from '@payload-config'

// Configurar Groq con el provider oficial
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Función para obtener contenido de Payload
async function getPayloadContent() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'contenido-blog',
      limit: 100,
    })

    // Formatear el contenido como texto para el contexto
    let context = '\n\n📚 INFORMACIÓN DE REDTICKETS:\n\n'
    
    result.docs.forEach(doc => {
      context += `\n━━━ ${doc.seccion?.toUpperCase()} ━━━\n`
      context += `Título: ${doc.titulo || 'N/A'}\n`
      
      if (doc.descripcion) {
        context += `${doc.descripcion}\n`
      }
      
      if (doc.estadisticas) {
        context += `📊 Estadísticas:\n`
        context += `- ${doc.estadisticas.transacciones} transacciones\n`
        context += `- ${doc.estadisticas.eventos_realizados} eventos realizados\n`
        context += `- ${doc.estadisticas.productores} productores\n`
      }
      
      if (doc.fundadores?.length) {
        context += `👥 Fundadores: ${doc.fundadores.map(f => `${f.nombre} (${f.cargo})`).join(', ')}\n`
      }
      
      if (doc.equipo?.length) {
        context += `👨‍💼 Equipo (${doc.equipo.length} personas): ${doc.equipo.map(e => e.nombre).join(', ')}\n`
      }
      
      if (doc.servicios_lista?.length) {
        context += `🎯 Servicios: ${doc.servicios_lista.map(s => s.servicio).join(', ')}\n`
      }
      
      if (doc.como_comprar?.introduccion) {
        context += `💳 Comprar: ${doc.como_comprar.introduccion}\n`
      }
      
      if (doc.como_vender?.introduccion) {
        context += `💰 Vender: ${doc.como_vender.introduccion}\n`
      }
      
      if (doc.politicas) {
        context += `📋 Políticas:\n`
        if (doc.politicas.cancelacion_eventos) {
          context += `- Cancelación: ${doc.politicas.cancelacion_eventos.substring(0, 150)}...\n`
        }
        if (doc.politicas.reprogramacion) {
          context += `- Reprogramación: ${doc.politicas.reprogramacion}\n`
        }
      }
      
      if (doc.ayuda_tecnica) {
        context += `🔧 Ayuda Técnica Tótem:\n`
        if (doc.ayuda_tecnica.uso_totem?.descripcion) {
          context += `- ${doc.ayuda_tecnica.uso_totem.descripcion}\n`
        }
        if (doc.ayuda_tecnica.cambio_rollo?.length) {
          context += `- Cambio de rollo: ${doc.ayuda_tecnica.cambio_rollo.length} pasos disponibles\n`
        }
        if (doc.ayuda_tecnica.solicitar_nuevos_rollos) {
          context += `- Rollos: ${doc.ayuda_tecnica.solicitar_nuevos_rollos}\n`
        }
      }
      
      if (doc.email || doc.telefono) {
        context += `📧 Contacto: ${doc.email || ''} ${doc.telefono || ''}\n`
      }
    })
    
    return context
  } catch (error) {
    console.error('❌ Error al obtener contenido de Payload:', error)
    return ''
  }
}

// Contexto del sistema optimizado según OpenAI Design Guidelines
const SYSTEM_PROMPT = `Eres un asistente de RedTickets, experto en venta de tickets y eventos en Uruguay.

🎯 CONOCIMIENTO COMPLETO DE REDTICKETS:

📊 ESTADÍSTICAS:
- 4,000,000 transacciones procesadas
- 20,000 eventos realizados
- 500+ productores activos

💳 CÓMO COMPRAR TICKETS (4 PASOS):
1. **Seleccionar evento**: Todos en redtickets.uy (salvo privados con link directo)
2. **Elegir cantidad y tipo**: Según disponibilidad del productor
3. **Seleccionar medio de pago**: Online o presencial (RedPagos/Abitab)
4. **Recibir tickets**: Por email como PDF, o descargar desde "Mis Tickets"

💰 CÓMO VENDER (PARA PRODUCTORES):
1. Crear evento en redtickets.net
2. Promocionar con URL única
3. Seguir ventas en tiempo real
4. Controlar acceso con app ControlTickets
5. Recibir liquidación post-evento

🎯 SERVICIOS PRINCIPALES:
- Venta Online y Presencial
- Control de Acceso con App
- Hard Ticketing (tótems físicos)
- Impresión de Tickets
- Reportes en Tiempo Real
- Asistencia Personalizada

📧 CONTACTO:
- Email: hola@redtickets.uy
- Tel: +598 94 636 018
- Web: redtickets.uy

📋 POLÍTICAS IMPORTANTES:
- **Cancelación**: Reintegro total si el organizador cancela (30-45 días)
- **Reprogramación**: Tarifa $80 por ticket si cambio de fecha
- **Devoluciones**: Según autorización del organizador

🎫 RECEPCIÓN DE TICKETS:
- Email con PDF automático
- Descarga desde "Mis Tickets" en tu cuenta
- Código QR único (una sola entrada)
- Permite ventanas emergentes para ver PDF

📍 SECCIONES VÁLIDAS PARA NAVEGAR:
inicio | sobre-nosotros | servicios | comunidad | ayuda | contacto

💬 FORMATO DE RESPUESTA:
1. Respuesta DIRECTA y COMPLETA (2-3 líneas máximo)
2. Acción con [ACTION:navigate:seccion|Label]

✅ EJEMPLOS:

Usuario: "como se compra?"
Tú: "Comprar es fácil: 1) Selecciona el evento en redtickets.uy 2) Elige cantidad y pago 3) Recibe tickets por email. ¿Necesitas más detalles? [ACTION:navigate:ayuda|Ver Guía Completa]"

Usuario: "que servicios tienen?"
Tú: "Ofrecemos venta online/presencial, control de acceso con app, hard ticketing, reportes en tiempo real y más. [ACTION:navigate:servicios|Ver Todos los Servicios]"

Usuario: "quiero vender entradas"
Tú: "Para vender: crea tu evento en redtickets.net, promociona, controla ventas y recibe liquidación. [ACTION:navigate:ayuda|Guía para Productores]"

Usuario: "gracias" / "ok" / "si"
Tú: "¡Con gusto! Si necesitas algo más, aquí estoy. 😊"

❌ NUNCA DIGAS:
- "te recomiendo que revises"
- "puedes escribirnos"
- "no tengo esa información"
- "consulta la sección de..."

🔑 REGLAS CRÍTICAS:
1. SIEMPRE responde con información específica
2. Usa los datos que tienes arriba
3. Máximo 3 líneas de texto
4. Un botón [ACTION] cuando sea útil
5. Sé directo y útil, no redirijas sin responder`

// Configurar CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Manejar preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: Request) {
  try {
    // 🔍 Debug: verificar que la API key existe
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY no está configurada en las variables de entorno')
      return new Response(JSON.stringify({ 
        error: 'API key no configurada. Contacta al administrador.' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { messages } = await req.json()

    // Verificar que hay mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ No se recibieron mensajes')
      return new Response(JSON.stringify({ error: 'No messages provided' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('📤 Enviando request a Groq con', messages.length, 'mensajes')

    // 🔥 OBTENER CONTENIDO DE PAYLOAD
    console.log('📚 Obteniendo contenido de Payload...')
    const payloadContext = await getPayloadContent()
    console.log('✅ Contenido de Payload obtenido:', payloadContext.substring(0, 200) + '...')

    // Construir prompt del sistema con contexto de Payload
    const systemPromptWithContext = SYSTEM_PROMPT + payloadContext

    // Usar streamText SIN tools (más simple y compatible)
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: systemPromptWithContext,
      messages,
      temperature: 0.7,
    })

    console.log('✅ Stream iniciado correctamente')

    // Retornar streaming de texto simple
    const response = result.toTextStreamResponse()
    
    // Agregar CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('❌ Error in chat API:', error)
    return new Response(JSON.stringify({ 
      error: 'Error al procesar el chat',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
