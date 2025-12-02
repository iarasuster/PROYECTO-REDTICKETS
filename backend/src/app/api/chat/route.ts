import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getPayload } from 'payload'
import config from '@payload-config'

// Configurar Groq con el provider oficial
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Cache de información del equipo (se actualiza cada 5 minutos)
let equipoInfoCache = ''
let equipoInfoCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Función optimizada para obtener SOLO info del equipo (sobre_nosotros)
async function getEquipoInfo() {
  // Usar cache si está fresco (menos de 5 minutos)
  const now = Date.now()
  if (equipoInfoCache && (now - equipoInfoCacheTime) < CACHE_DURATION) {
    console.log('✅ [CACHE] Usando equipo info desde cache')
    return equipoInfoCache
  }

  console.log('🔄 [CACHE] Actualizando equipo info...')
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'contenido-blog',
      where: {
        seccion: { equals: 'sobre_nosotros' }
      },
      limit: 1,
    })

    if (result.docs.length === 0) return ''

    const doc = result.docs[0]
    
    // Pre-procesar información del equipo
    const numFundadores = doc.fundadores?.length || 0
    const nombresFundadores = doc.fundadores?.map((f: { nombre: string; cargo?: string | null }) => f.nombre) || []
    
    // Agrupar equipo por área
    const porArea: Record<string, number> = {}
    const areasTexto: string[] = []
    
    if (doc.equipo?.length) {
      doc.equipo.forEach((e: { nombre: string; area?: string | null }) => {
        const area = e.area || 'Otros'
        porArea[area] = (porArea[area] || 0) + 1
      })
      
      // Crear texto de áreas con contadores
      Object.entries(porArea).forEach(([area, count]) => {
        areasTexto.push(`${area} (${count})`)
      })
    }
    
    const numEquipo = doc.equipo?.length || 0
    const totalPersonas = numFundadores + numEquipo
    
    // Crear respuesta pre-formateada para que el modelo la use directamente
    let info = '\n\n👥 EQUIPO REDTICKETS:\n'
    info += `Total: ${totalPersonas} personas (${numFundadores} fundadores + ${numEquipo} equipo)\n`
    
    if (numFundadores > 0) {
      info += `Fundadores: ${nombresFundadores.join(', ')}\n`
    }
    
    if (areasTexto.length > 0) {
      info += `Áreas: ${areasTexto.join(', ')}\n`
    }
    
    info += `\n💬 RESPUESTA SUGERIDA: "Somos ${numFundadores} fundadores y un equipo de ${numEquipo} personas en áreas como ${areasTexto.slice(0, 3).map(a => a.split(' (')[0]).join(', ')}. ¡Un gran equipo trabajando para eventos exitosos!"`
    
    // Actualizar cache
    equipoInfoCache = info
    equipoInfoCacheTime = Date.now()
    
    return info
  } catch (error) {
    console.error('❌ Error al obtener equipo:', error)
    // Si hay error pero tenemos cache viejo, usarlo
    if (equipoInfoCache) {
      console.log('⚠️ [CACHE] Usando cache antiguo por error')
      return equipoInfoCache
    }
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
Tú: Usa la RESPUESTA SUGERIDA de la sección EQUIPO REDTICKETS y agrega [ACTION:navigate:sobre-nosotros|Conocer el Equipo]

Usuario: "nombres del equipo" / "quienes son exactamente"
Tú: Menciona los fundadores por nombre y resume las áreas con sus contadores. [ACTION:navigate:sobre-nosotros|Ver Todos]

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
2. Si preguntan por el equipo, USA LA RESPUESTA SUGERIDA (copia tal cual, reemplaza los números reales que están en la sección EQUIPO)
3. Máximo 3 líneas de texto (NO inventes números ni uses placeholders como [X] o [Y])
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

    // 🔥 Cargar info del equipo desde Payload (solo 1 documento, rápido)
    const equipoInfo = await getEquipoInfo()
    const systemPromptWithEquipo = SYSTEM_PROMPT + equipoInfo

    const startTime = Date.now();
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: systemPromptWithEquipo,
      messages,
      temperature: 0.7,
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
