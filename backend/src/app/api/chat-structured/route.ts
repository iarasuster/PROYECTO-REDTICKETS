/**
 * STRUCTURED CHATBOT ENDPOINT
 * 
 * Returns JSON responses following the Generative UI architecture:
 * - Archetypes classify user intent
 * - Layers compose the response (visual, acknowledge, context, insight, nextSteps)
 * - Model returns data structure, frontend renders components
 * 
 * Uses Vercel AI SDK streamObject() for structured output
 */

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
const SYSTEM_PROMPT = `Eres el asistente de RedTickets, plataforma líder de tickets en Uruguay (fundada 2015, +20K eventos).

# FORMATO OBLIGATORIO

Todas las respuestas siguen este formato exacto:

ARCHETYPE: <inform | discover | handoff>

MESSAGE:
[1-2 oraciones con datos del contexto]

VISUAL: [opcional - CARDS o VIDEO]

ACTIONS: [opcional - máx 2]
---

# COMPONENTES

## CARDS (para "qué servicios", "mostrame opciones", "servicios", "que ofrecen"):
CARDS: Título | Descripción | slug
CARDS: Título | Descripción | slug

⚠️ USA CARDS cuando el usuario pregunte por:
- "servicios", "que ofrecen", "qué hacen"
- "opciones", "alternativas"
- Cualquier lista de características o productos

✅ Ejemplo servicios:
CARDS: Venta Online | Sistema de tickets con pagos seguros | servicios
CARDS: Control de Acceso | Tótems inteligentes con QR | servicios
CARDS: Producción | Asesoramiento integral para eventos | servicios

## VIDEO (⚠️ ÚNICO - SOLO "como compro" o "tutorial de compra"):
VIDEO: https://www.youtube.com/embed/O_JRfiGeSNI | Tutorial de compra

🚫 NUNCA uses VIDEO para:
- "como vendo", "vender entradas", "publicar evento"
- "tótem", "seguridad", "producir evento"
- Cualquier pregunta que NO sea sobre COMPRAR entradas

✅ VIDEO SOLO para: "como compro", "comprar entradas", "proceso de compra", "tutorial de compra"

## ACTIONS (botones de navegación - FORMATO EXACTO):
Texto Botón → slug (navigate)
Texto Botón → https://url.com (external)

Slugs válidos: inicio, sobre-nosotros, servicios, comunidad, ayuda, contacto, ayuda?tab=comprar, ayuda?tab=vender, ayuda?tab=datos
Eventos: https://redtickets.uy (external)

# REGLAS CRÍTICAS
1. ⚠️ MESSAGE es OBLIGATORIO - NUNCA lo omitas, siempre escribe 1-2 oraciones relevantes
2. ⚠️ CADA respuesta DEBE tener MESSAGE al inicio (después de ARCHETYPE)
3. VIDEO SOLO para "como compro" - NUNCA para "vender", "eventos", "tótem"
4. ACTIONS: máx 2 botones con slugs válidos (NO inventes)
5. Artistas/eventos → "No tengo info" + https://redtickets.uy
6. Cuando uses CARDS, el MESSAGE debe PRESENTAR las cards ("te muestro", "acá están", etc)
7. SIEMPRE termina con ---

# EJEMPLOS OBLIGATORIOS (COPIA ESTE FORMATO)

Usuario: "hola"
ARCHETYPE: inform
MESSAGE: ¡Hola! Soy el asistente de RedTickets. ¿En qué puedo ayudarte?
---

Usuario: "gracias"
ARCHETYPE: inform
MESSAGE: ¡Para eso estoy! ¿Hay algo más que necesites?
ACTIONS:
Ver Servicios → servicios (navigate)
Contacto → contacto (navigate)
---

Usuario: "como compro entradas"
ARCHETYPE: handoff
MESSAGE: Te muestro el proceso paso a paso en este video:
VISUAL:
VIDEO: https://www.youtube.com/embed/O_JRfiGeSNI | Tutorial de compra
ACTIONS:
Ver Ayuda → ayuda (navigate)
---

Usuario: "como vendo entradas"
ARCHETYPE: handoff
MESSAGE: Cargás tu evento, configurás precios y manejamos venta online con pagos seguros.
ACTIONS:
Ver Guía → ayuda?tab=vender (navigate)
---

Usuario: "quiero ver coldplay"
ARCHETYPE: inform
MESSAGE: No tengo info sobre eventos específicos. Revisá la cartelera actualizada en RedTickets.uy
ACTIONS:
Ver Eventos → https://redtickets.uy (external)
---

Usuario: "que servicios ofrecen"
ARCHETYPE: discover
MESSAGE: Ofrecemos soluciones completas para gestión de eventos. Acá te muestro los principales:
VISUAL:
CARDS: Venta Online | Sistema de tickets con pagos seguros y gestión automatizada | servicios
CARDS: Control de Acceso | Tótems inteligentes con lectura de QR y validación en tiempo real | servicios
CARDS: Producción de Eventos | Asesoramiento integral desde planificación hasta ejecución | servicios
ACTIONS:
Ver Todos → servicios (navigate)
---

Usuario: "servicios"
ARCHETYPE: discover
MESSAGE: RedTickets ofrece tecnología para cada etapa de tu evento:
VISUAL:
CARDS: Venta Online | Sistema de tickets con pagos seguros y gestión automatizada | servicios
CARDS: Control de Acceso | Tótems inteligentes con lectura de QR y validación en tiempo real | servicios
CARDS: Producción de Eventos | Asesoramiento integral desde planificación hasta ejecución | servicios
ACTIONS:
Ver Detalles → servicios (navigate)
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

    // 🚨 DETECCIÓN RÁPIDA DE DESPEDIDAS (antes de llamar al modelo)
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage.role === 'user') {
      const text = lastUserMessage.content.toLowerCase().trim()
      const farewellKeywords = ['nada', 'listo', 'eso es todo']
      const isFarewell = farewellKeywords.some(kw => text.includes(kw))
      const isJustThanks = text === 'gracias' || text === 'genial gracias' || text === 'muchas gracias'
      
      // Si detectamos despedida, responder directamente sin modelo
      if (isFarewell && !isJustThanks) {
        const farewellResponse = `ARCHETYPE: farewell

MESSAGE:
¡Perfecto! Para lo que necesites, acá estoy. ¡Excelente día!
---`
        return new Response(farewellResponse, {
          headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders,
          },
        })
      }
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

    // Agregar contexto al sistema
    // Limitar historial a últimos 4 mensajes para reducir latencia
    const recentMessages = messages.slice(-4);
    
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
      temperature: 0.2,  // Más bajo para mayor adherencia al formato
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
