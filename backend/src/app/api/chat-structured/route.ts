
import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ContenidoBlog } from '@/payload-types'

// Configurar Groq
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Cache de contenido (actualizado cada 5 minutos)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let contentCache: any = null
let contentCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Obtener contenido del sitio desde Payload CMS
 */
async function getContentData() {
  const now = Date.now()
  if (contentCache && (now - contentCacheTime) < CACHE_DURATION) {
    console.log('✅ [CACHE] Usando content data desde cache')
    return contentCache
  }

  console.log('🔄 [CACHE] Actualizando content data...')
  try {
    const payload = await getPayload({ config })
    
    // Obtener todas las secciones
    const secciones = await payload.find({
      collection: 'contenido-blog',
      limit: 20,
    })

    // Construir data estructurada
    const data = {
      secciones: secciones.docs.map((doc: ContenidoBlog) => ({
        slug: doc.seccion,
        titulo: doc.titulo,
        descripcion: doc.descripcion || '',
        estadisticas: doc.estadisticas,
      })),
      equipo: [] as Array<{nombre: unknown; area: unknown; cargo?: unknown}>,
      servicios: [] as Array<{titulo: unknown; descripcion: unknown}>,
      video_tutorial: 'https://www.youtube.com/embed/O_JRfiGeSNI',
    }

    // Extraer equipo de "sobre_nosotros"
    const sobreNosotros = secciones.docs.find((d: ContenidoBlog) => d.seccion === 'sobre_nosotros')
    if (sobreNosotros) {
      if (sobreNosotros.fundadores) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.equipo.push(...(sobreNosotros.fundadores as any[]).map((f: any) => ({
          nombre: f.nombre,
          area: 'Fundador',
          cargo: f.cargo,
        })))
      }
      if (sobreNosotros.equipo) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.equipo.push(...(sobreNosotros.equipo as any[]).map((e: any) => ({
          nombre: e.nombre,
          area: e.area || 'Equipo',
        })))
      }
    }

    // Extraer servicios
    const serviciosDoc = secciones.docs.find((d: ContenidoBlog) => d.seccion === 'servicios')
    if (serviciosDoc && serviciosDoc.servicios_lista) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.servicios = (serviciosDoc.servicios_lista as any[]).map((s: any) => ({
        titulo: s.titulo,
        descripcion: s.descripcion,
      }))
    }

    contentCache = data
    contentCacheTime = Date.now()
    return data
  } catch (error) {
    console.error('❌ Error al obtener contenido:', error)
    return contentCache || { secciones: [], equipo: [], servicios: [], video_tutorial: '' }
  }
}

/**
 * Sistema Prompt para Chatbot Estructurado con Texto
 */
const SYSTEM_PROMPT = `Eres el asistente de RedTickets, plataforma líder de tickets en Uruguay (fundada 2015, +20K eventos). Tono amigable, profesional, español rioplatense (tuteo), conciso.

FORMATO OBLIGATORIO:
ARCHETYPE: <inform | discover | handoff>
MESSAGE: [respuesta natural adaptada al contexto]
VISUAL: [opcional - CARDS o VIDEO]
ACTIONS: [opcional - máx 2]
---

COMPONENTES:

CARDS: Título | Descripción | slug
Ejemplo: CARDS: Venta Online | Sistema de tickets con pagos seguros | servicios

VIDEO (RESTRICCIÓN ESTRICTA):
- ÚNICAMENTE para preguntas EXACTAS: "cómo comprar entradas" / "cómo compro entradas" / "tutorial de compra"
- URL única: https://www.youtube.com/embed/O_JRfiGeSNI
- NUNCA usar para: quiénes son, sobre la empresa, servicios, vender, eventos, contacto
- Para todo lo demás: usar solo MESSAGE + CARDS + ACTIONS

ACTIONS (máx 2):
Texto → slug (navigate)
Texto → url (external)

Slugs: inicio, sobre-nosotros, servicios, comunidad, contacto, ayuda, ayuda?tab=comprar, ayuda?tab=vender, ayuda?tab=devoluciones, ayuda?tab=preguntas, ayuda?tab=politicas

REGLAS:
1. MESSAGE obligatorio siempre
2. VIDEO solo para tutorial compra de entradas (nada más)
3. Eventos específicos: https://redtickets.uy
4. CARDS: presentarlas antes en MESSAGE
5. Terminar con ---
6. "Gracias/dale/ok" intermedios: ofrecer ayuda + ACTIONS (NO despedirse)
7. Despedidas finales (nada/chau/listo): mensaje cálido SIN ACTIONS
8. No entiendes: pedir aclaración + ACTIONS ayuda/contacto
9. Fuera de scope: redirigir a contacto

EJEMPLOS:

"hola"
ARCHETYPE: inform
MESSAGE: ¡Hola! Soy el asistente de RedTickets. ¿En qué puedo ayudarte?
---

"quienes son"
ARCHETYPE: inform
MESSAGE: RedTickets es una plataforma líder de tickets en Uruguay, fundada en 2015 y con más de 20.000 eventos en su cartelera.
ACTIONS:
Sobre Nosotros → sobre-nosotros (navigate)
Ver Servicios → servicios (navigate)
---

"como los contacto"
ARCHETYPE: handoff
MESSAGE: Podés contactarnos a través de nuestro mail de contacto hola@redtickets.uy , por teléfono +598 94 636 018 o
llenando el formulario en nuestra página de contacto.
ACTIONS:
Contacto → contacto (navigate)
---

"gracias"
ARCHETYPE: inform
MESSAGE: ¡De nada! ¿Hay algo más en lo que pueda ayudarte?
ACTIONS:
Ver Servicios → servicios (navigate)
Ayuda → ayuda (navigate)
---

"como compro entradas"
ARCHETYPE: handoff
MESSAGE: Te muestro el proceso paso a paso en este video:
VISUAL:
VIDEO: https://www.youtube.com/embed/O_JRfiGeSNI | Tutorial de compra
ACTIONS:
Ver Ayuda → ayuda?tab=comprar (navigate)
---

"que servicios ofrecen"
ARCHETYPE: discover
MESSAGE: Ofrecemos soluciones completas para gestión de eventos. Acá te muestro los principales:
VISUAL:
CARDS: Venta Online | Sistema de tickets con pagos seguros y gestión automatizada | servicios
CARDS: Control de Acceso | Tótems inteligentes con lectura de QR y validación en tiempo real | servicios
CARDS: Producción de Eventos | Asesoramiento integral desde planificación hasta ejecución | servicios
ACTIONS:
Ver Todos → servicios (navigate)
---

"como vendo mis entradas"
ARCHETYPE: discover
MESSAGE: Para vender en RedTickets, primero registrate como organizador. Acá te muestro por dónde empezar:
VISUAL:
CARDS: Guía para Vendedores | Paso a paso para crear tu evento y vender tickets | ayuda?tab=vender
CARDS: Servicios Disponibles | Conoce todas las herramientas que tenés a disposición | servicios
ACTIONS:
Ver Guía Completa → ayuda?tab=vender (navigate)
Hablar con Ventas → contacto (navigate)
---

"hay eventos este finde"
ARCHETYPE: handoff
MESSAGE: Para ver todos los eventos disponibles, te llevo a nuestro sitio principal donde encontrás la agenda completa y actualizada.
ACTIONS:
Ver Eventos → https://redtickets.uy (external)
---

"no entiendo nada"
ARCHETYPE: inform
MESSAGE: Disculpá si no fui claro. ¿Podrías contarme específicamente qué necesitás? Por ejemplo: comprar entradas, vender tickets, información sobre servicios...
ACTIONS:
Ver Ayuda → ayuda (navigate)
Contacto Directo → contacto (navigate)
---`

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('No messages provided', { 
        status: 400,
        headers: corsHeaders,
      })
    }

    const lastUserMessage = messages[messages.length - 1]
    const lastMessage = lastUserMessage.content.toLowerCase().trim()

    // ⚡ DETECCIÓN DE DESPEDIDAS FINALES (patrones flexibles)
    const farewellPatterns = [
      /^(en\s+)?nada(\s+m[aá]s)?$/i,           // nada, en nada, nada más, en nada mas
      /^(en\s+)?nada\s+(entonces|chau|adi[oó]s)$/i,  // en nada chau, nada adiós
      /^(est[aá]\s+bien|esta\s+bien|perfecto|ok|dale)$/i,  // está bien, perfecto, ok, dale
      /^(chau|adi[oó]s|adios|hasta\s+luego)$/i,      // chau, adiós, hasta luego
      /^no(\s+gracias)?$/i,                    // no, no gracias
      /^(ya\s+est[aá]|listo|eso\s+es\s+todo)$/i,  // ya está, listo, eso es todo
    ]

    const isFarewell = farewellPatterns.some(pattern => pattern.test(lastMessage))

    // Si es despedida final, responder inmediatamente
    if (isFarewell) {
      const farewellResponse = `ARCHETYPE: inform
MESSAGE: ¡Que tengas un excelente día! Cualquier cosa acá estoy.
---`
      return new Response(farewellResponse, {
        headers: {
          'Content-Type': 'text/plain',
          ...corsHeaders,
        },
      })
    }

    // Obtener contenido del sitio
    const contentData = await getContentData()

    // Construir contexto para el modelo (SOLO INFO ESENCIAL)
    const contextPrompt = `
# DATOS DEL CMS (para respuestas específicas)

## Fundadores (${(contentData.equipo as Record<string, unknown>[]).filter((e: any) => e.area === 'Fundador').length}):
${(contentData.equipo as Record<string, unknown>[]).filter((e: any) => e.area === 'Fundador').map((e: Record<string, unknown>) => `- ${e.nombre}${e.cargo ? ` (${e.cargo})` : ''}`).join('\n')}

## Servicios:
${(contentData.servicios as Record<string, unknown>[]).map((s: Record<string, unknown>) => `• ${s.titulo}`).join('\n')}

⚠️ IMPORTANTE: Esta es la ÚNICA información disponible. NO inventes datos. Si algo no está aquí, dilo honestamente.
`

    // Limitar historial a últimos 4 mensajes para reducir latencia
    const recentMessages = messages.slice(-4)
    
    const enhancedMessages = [
      {
        role: 'system',
        content: contextPrompt,
      },
      ...recentMessages,
    ]

    // 🤖 GENERAR RESPUESTA ESTRUCTURADA CON GROQ
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: SYSTEM_PROMPT,
      messages: enhancedMessages,
      temperature: 0.2,
    })

    // Stream response directo (más rápido)
    return result.toTextStreamResponse({
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('❌ Error en /api/chat-structured:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Unknown error',
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
}