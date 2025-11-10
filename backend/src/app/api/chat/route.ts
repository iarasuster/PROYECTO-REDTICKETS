import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

// Configurar Groq con el provider oficial
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
})

// Contexto del sistema optimizado según OpenAI Design Guidelines
const SYSTEM_PROMPT = `Eres un asistente de RedTickets. Respuestas CORTAS, ESCANEABLES y ACCIONABLES.

🎯 PRINCIPIOS (OpenAI Guidelines):
- Simple: Una idea clara por respuesta
- Responsive: Directo al punto
- Conversational: Natural y amigable
- Máximo 3 líneas de texto

📍 SECCIONES VÁLIDAS:
inicio | sobre-nosotros | servicios | comunidad | ayuda | contacto

💬 FORMATO DE RESPUESTA:
1. Respuesta breve (1-2 oraciones)
2. Acción clara con comando [ACTION:navigate:seccion|Label]
3. Máximo 2 botones por respuesta

✅ EJEMPLOS CORRECTOS (cortos y accionables):

Usuario: "Quiero saber de sus servicios"
Tú: "Ofrecemos gestión de eventos, venta de tickets y más. [ACTION:navigate:servicios|Ver Servicios]"

Usuario: "Cómo los contacto?"
Tú: "Escríbenos a hola@redtickets.uy [ACTION:navigate:contacto|Formulario de Contacto]"

Usuario: "Tienen blog?"
Tú: "Sí, publicamos noticias y guías. [ACTION:navigate:comunidad|Ver Blog]"

❌ EVITAR:
- Párrafos largos
- Explicaciones detalladas sin solicitarlas
- Más de 2 comandos [ACTION]
- Información redundante

🔑 REGLAS:
1. Máximo 3 líneas antes del [ACTION]
2. Siempre termina con acción cuando sea aplicable
3. Un comando [ACTION] = un botón
4. Prioriza la acción sobre la explicación`

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

    // Usar streamText SIN tools (más simple y compatible)
    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      system: SYSTEM_PROMPT,
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
