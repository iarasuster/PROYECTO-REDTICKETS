import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Configurar Groq con el provider oficial
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Función helper para obtener contenido de Payload (usada por el tool buscarEnPayload)
// No se llama en cada request, solo cuando el modelo detecta que necesita info específica

// Contexto del sistema optimizado según OpenAI Design Guidelines
const SYSTEM_PROMPT = `Eres un asistente de RedTickets, experto en venta de tickets y eventos en Uruguay.

🎯 CONOCIMIENTO COMPLETO DE REDTICKETS:

📊 ESTADÍSTICAS:
- 4,000,000 transacciones procesadas
- 20,000 eventos realizados
- 500+ productores activos

👥 EQUIPO REDTICKETS:
RedTickets cuenta con un equipo multidisciplinario dedicado a ofrecer la mejor experiencia:
- **Fundadores**: Expertos en tecnología y eventos que lideraron la creación de la plataforma
- **Equipo Técnico**: Desarrolladores y especialistas en sistemas de ticketing
- **Equipo Comercial**: Asesoramiento personalizado para productores y clientes
- **Soporte**: Asistencia 24/7 para resolver consultas técnicas y operativas
- **Logística**: Coordinación de hard ticketing y tótems en todo Uruguay

El equipo trabaja en conjunto para garantizar eventos exitosos, transacciones seguras y soporte continuo.

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

Usuario: "quienes estan en el equipo?" / "quienes son?" / "que equipo tienen?"
Tú: "Somos un equipo multidisciplinario: fundadores expertos en tecnología y eventos, desarrolladores, comerciales, soporte 24/7 y logística en todo Uruguay. [ACTION:navigate:sobre-nosotros|Conocer el Equipo]"

Usuario: "que es redtickets?" / "quienes son ustedes?"
Tú: "Somos la plataforma líder de venta de tickets en Uruguay con 4M de transacciones, 20K eventos y 500+ productores. Ofrecemos venta online/presencial, control de acceso y más. [ACTION:navigate:sobre-nosotros|Conocer RedTickets]"

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
5. Sé directo y útil, no redirijas sin responder

🔧 TOOL DISPONIBLE:
Tienes acceso al tool 'buscarEnPayload'. ÚSALO OBLIGATORIAMENTE cuando:
- Te pregunten "quiénes son" / "quién es el equipo" / "equipo" / "fundadores" / "integrantes"
- Necesites nombres exactos de personas
- Te pidan políticas completas palabra por palabra
- Requieras información técnica específica no incluida arriba

NO intentes adivinar o inventar nombres. Si no los sabes, usa el tool.`

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
  console.log('🔵 [CHAT] Request recibido:', new Date().toISOString());
  
  try {
    // 🔍 Debug: verificar que la API key existe
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [CHAT] GROQ_API_KEY no está configurada en las variables de entorno')
      return new Response(JSON.stringify({ 
        error: 'API key no configurada. Contacta al administrador.' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { messages } = await req.json()
    console.log('📝 [CHAT] Mensajes recibidos:', messages?.length || 0);

    // Verificar que hay mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ [CHAT] No se recibieron mensajes')
      return new Response(JSON.stringify({ error: 'No messages provided' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('📤 [CHAT] Enviando request a Groq...')

    // 🔥 Sistema híbrido: Prompt estático + Tool para Payload cuando se necesite
    const startTime = Date.now();
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      tools: {
        // Tool que se activa para obtener info detallada de Payload
        buscarEnPayload: {
          description: 'SIEMPRE usa esta herramienta cuando te pregunten sobre: el equipo de RedTickets, fundadores, quiénes son, nombres de personas, integrantes, políticas completas, detalles técnicos exactos, o cualquier información específica que no esté explícita en el SYSTEM_PROMPT.',
          inputSchema: z.object({
            seccion: z.string().describe('Sección a buscar: sobre_nosotros, servicios, ayuda, comunidad, inicio, contacto'),
            tema: z.string().optional().describe('Tema específico: equipo, fundadores, politicas, ayuda_tecnica, como_comprar, etc.'),
          }),
          execute: async ({ seccion, tema }: { seccion: string; tema?: string }) => {
            console.log(`🔍 [CHAT-TOOL] Buscando en Payload: seccion=${seccion}, tema=${tema}`)
            try {
              const payload = await getPayload({ config })
              const result = await payload.find({
                collection: 'contenido-blog',
                where: {
                  seccion: { equals: seccion }
                },
                limit: 1,
              })

              if (result.docs.length === 0) {
                return { error: 'No se encontró información para esa sección' }
              }

              const doc = result.docs[0]
              const info: Record<string, unknown> = {}

              // Extraer solo lo relevante según el tema
              if (tema === 'equipo' || tema === 'fundadores') {
                info.fundadores = doc.fundadores || []
                info.equipo = doc.equipo || []
              } else if (tema === 'politicas') {
                info.politicas = doc.politicas || {}
              } else if (tema === 'ayuda_tecnica') {
                info.ayuda_tecnica = doc.ayuda_tecnica || {}
              } else {
                // Retornar todo el documento si no se especifica tema
                return doc
              }

              console.log(`✅ [CHAT-TOOL] Información encontrada`)
              return info
            } catch (error) {
              console.error('❌ [CHAT-TOOL] Error:', error)
              return { error: 'No pude acceder a la información en este momento' }
            }
          }
        }
      },
    })

    const groqTime = Date.now() - startTime;
    console.log(`✅ [CHAT] Stream iniciado en ${groqTime}ms`)

    // Retornar streaming de texto simple
    const response = result.toTextStreamResponse()
    
    // Agregar CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('❌ [CHAT] Error:', error)
    console.error('❌ [CHAT] Stack:', error instanceof Error ? error.stack : 'No stack')
    
    return new Response(JSON.stringify({ 
      error: 'Error al procesar el chat',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
