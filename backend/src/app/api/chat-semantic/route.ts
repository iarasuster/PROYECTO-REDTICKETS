/**
 * CHATBOT ENDPOINT CON BÚSQUEDA SEMÁNTICA
 * 
 * Integra Groq + búsqueda semántica en embeddings
 * + Generative UI con acciones dinámicas
 * 
 * Flujo:
 * 1. Usuario hace pregunta
 * 2. Sistema busca posts relevantes con embeddings
 * 3. Envía contexto a Groq para respuesta inteligente
 * 4. Groq devuelve respuesta + comandos [ACTION]
 * 5. Frontend parsea y renderiza botones dinámicos
 */

import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getContextualAnswer } from '@/lib/semanticSearch'

// Configurar Groq
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Prompt del sistema mejorado con contexto del blog (OpenAI Guidelines)
const SYSTEM_PROMPT = `Eres un asistente de RedTickets. Respuestas CORTAS, ESCANEABLES y ACCIONABLES.

🎯 PRINCIPIOS (OpenAI Guidelines):
- Simple: Una idea clara por respuesta
- Responsive: Directo al punto
- Intelligent: Usa el contexto del blog cuando sea relevante
- Máximo 3 líneas de texto

📍 SECCIONES VÁLIDAS:
inicio | sobre-nosotros | servicios | comunidad | ayuda | contacto

💬 FORMATO DE RESPUESTA:
1. Respuesta breve (1-2 oraciones)
2. Menciona artículos relevantes del blog si aplica
3. Máximo 2 comandos [ACTION:navigate:slug|Label]

✅ EJEMPLOS CON CONTEXTO DE BLOG:

Usuario: "Cómo comprar entradas?"
Tú: "Es muy simple: busca tu evento y completa el pago. [ACTION:navigate:guia-comprar-entradas|📖 Leer Guía Completa]"

Usuario: "Qué servicios ofrecen?"
Tú: "Gestión de eventos, venta de tickets y más. [ACTION:navigate:servicios|Ver Servicios] [ACTION:navigate:casos-de-exito|Ver Casos de Éxito]"

❌ EVITAR:
- Párrafos largos
- Más de 2 botones
- Copiar/pegar contenido del blog completo
- Información redundante

🔑 REGLAS:
1. Máximo 3 líneas antes del [ACTION]
2. Usa contexto del blog para dar respuestas precisas
3. Máximo 2 comandos [ACTION] por respuesta
4. Prioriza acción sobre explicación`

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Preflight request
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

    // Obtener el último mensaje del usuario
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || ''

    // 🔍 BÚSQUEDA SEMÁNTICA EN EL BLOG
    let enhancedMessages = messages

    try {
      console.log(`🔍 Buscando en blog: "${lastUserMessage}"`)
      
      // Buscar posts relevantes
      const result = await getContextualAnswer(lastUserMessage, 3) as any
      const { context, actions } = result
      
      // blogContext guardado para debugging si se necesita
      console.log(`✅ Contexto encontrado (${actions.length} acciones)`)

      // Inyectar contexto del blog en el sistema
      if (context && context !== 'No se encontró información relevante en el blog.') {
        enhancedMessages = [
          {
            role: 'system',
            content: `CONTEXTO DEL BLOG (usa esta información para responder):

${context}

Menciona estos artículos si son relevantes y genera comandos [ACTION:navigate:slug|label] para que el usuario pueda leerlos.`,
          },
          ...messages,
        ]
      }

    } catch (searchError) {
      console.warn('⚠️  Error en búsqueda semántica:', searchError)
      // Continuar sin contexto del blog
    }

    // 🤖 GENERAR RESPUESTA CON GROQ
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'), // Ultra-rápido
      system: SYSTEM_PROMPT,
      messages: enhancedMessages,
      temperature: 0.7,
    })

    // Convertir a stream de texto
    return result.toTextStreamResponse({
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('❌ Error en /api/chat:', error)
    
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
