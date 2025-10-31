/**
 * MÓDULO: Búsqueda Semántica
 *
 * Funciones para buscar posts relevantes usando embeddings
 * y similitud de coseno.
 *
 * Uso:
 *   import { searchPosts } from './semanticSearch.js'
 *   const results = await searchPosts("¿Cómo comprar entradas?", 3)
 */

import { createOpenAI } from '@ai-sdk/openai'
import { embed } from 'ai'
import fs from 'fs/promises'
import 'dotenv/config'

// Configurar Groq
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDINGS_FILE = 'blogEmbeddings.json'

/**
 * Calcula similitud de coseno entre dos vectores
 *
 * @param {number[]} vecA - Vector A
 * @param {number[]} vecB - Vector B
 * @returns {number} - Similitud entre 0 y 1
 */
function cosineSimilarity(vecA, vecB) {
  // Producto punto
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  // Evitar división por cero
  if (normA === 0 || normB === 0) return 0

  // Similitud de coseno
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Busca posts relevantes usando búsqueda semántica
 *
 * @param {string} query - Pregunta del usuario
 * @param {number} topK - Número de resultados a devolver
 * @returns {Promise<Array>} - Posts ordenados por relevancia
 */
export async function searchPosts(query, topK = 3) {
  try {
    // 1. Cargar embeddings desde archivo
    console.log('📂 Cargando embeddings...')
    const embeddingsData = await fs.readFile(EMBEDDINGS_FILE, 'utf-8')
    const blogEmbeddings = JSON.parse(embeddingsData)

    if (blogEmbeddings.length === 0) {
      console.warn('⚠️  No hay embeddings disponibles')
      return []
    }

    // 2. Generar embedding de la query del usuario
    console.log(`🔍 Generando embedding para: "${query}"`)
    const { embedding: queryVector } = await embed({
      model: groq.embedding(EMBEDDING_MODEL),
      value: query,
    })

    // 3. Calcular similitudes con todos los posts
    console.log('⚙️  Calculando similitudes...')
    const similarities = blogEmbeddings.map((post) => ({
      ...post,
      similarity: cosineSimilarity(queryVector, post.vector),
    }))

    // 4. Ordenar por similitud (mayor a menor)
    similarities.sort((a, b) => b.similarity - a.similarity)

    // 5. Devolver top K resultados
    const topResults = similarities.slice(0, topK)

    console.log(`✅ Se encontraron ${topResults.length} resultados relevantes`)
    topResults.forEach((result, i) => {
      console.log(
        `   ${i + 1}. "${result.title}" (similitud: ${(result.similarity * 100).toFixed(1)}%)`,
      )
    })

    return topResults
  } catch (error) {
    console.error('❌ Error en búsqueda semántica:', error)
    throw error
  }
}

/**
 * Formatea resultados de búsqueda para el chatbot
 *
 * @param {Array} results - Resultados de searchPosts()
 * @returns {string} - Texto formateado con contexto
 */
export function formatContextForChat(results) {
  if (!results || results.length === 0) {
    return 'No se encontró información relevante en el blog.'
  }

  let context = 'Información relevante del blog:\n\n'

  results.forEach((result, index) => {
    context += `${index + 1}. ${result.title}\n`
    context += `   ${result.excerpt || result.content.substring(0, 200)}...\n`
    context += `   URL: /blog/${result.slug}\n\n`
  })

  return context
}

/**
 * Genera respuesta del chatbot con contexto del blog
 *
 * @param {string} userQuestion - Pregunta del usuario
 * @param {number} topK - Número de posts relevantes
 * @returns {Promise<Object>} - Respuesta con contexto y acciones
 */
export async function getContextualAnswer(userQuestion, topK = 3) {
  // Buscar posts relevantes
  const relevantPosts = await searchPosts(userQuestion, topK)

  // Formatear contexto
  const context = formatContextForChat(relevantPosts)

  // Preparar acciones de Generative UI
  const actions = relevantPosts
    .filter((post) => post.similarity > 0.5) // Solo posts muy relevantes
    .map((post) => ({
      type: 'navigate',
      target: post.slug,
      label: `Leer: ${post.title}`,
      url: `/blog/${post.slug}`,
    }))

  return {
    context, // Texto para el prompt del chatbot
    relevantPosts, // Posts completos
    actions, // Acciones de UI para botones
  }
}

// Exportar por defecto la función principal
export default searchPosts
