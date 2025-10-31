/**
 * SCRIPT: Generate Embeddings con Groq
 *
 * Este script:
 * 1. Obtiene todos los posts desde /api/blog-posts
 * 2. Genera embeddings usando Groq API (text-embedding-3-small)
 * 3. Guarda los vectores en blogEmbeddings.json
 *
 * Uso: node generateEmbeddings.js
 */

import { createOpenAI } from '@ai-sdk/openai'
import { embed } from 'ai'
import fs from 'fs/promises'
import 'dotenv/config'

// Configurar Groq con endpoint OpenAI-compatible
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

// Configuración
const API_URL = process.env.BLOG_API_URL || 'http://localhost:3000/api/blog-posts'
const OUTPUT_FILE = 'blogEmbeddings.json'
const EMBEDDING_MODEL = 'text-embedding-3-small' // Modelo de embeddings de Groq

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando generación de embeddings...\n')

  try {
    // 1. Obtener posts desde la API
    console.log(`📡 Fetching posts desde: ${API_URL}`)
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const posts = data.posts || []

    console.log(`✅ Se encontraron ${posts.length} posts\n`)

    if (posts.length === 0) {
      console.log('⚠️  No hay posts para procesar')
      return
    }

    // 2. Generar embeddings para cada post
    const embeddings = []

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      console.log(`[${i + 1}/${posts.length}] Procesando: "${post.title}"`)

      try {
        // Combinar título y contenido para mejor contexto
        const textToEmbed = `${post.title}\n\n${post.content}`.trim()

        // Generar embedding usando Groq
        const { embedding } = await embed({
          model: groq.embedding(EMBEDDING_MODEL),
          value: textToEmbed,
        })

        // Guardar resultado
        embeddings.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          autor: post.autor,
          fecha: post.fecha,
          vector: embedding, // Array de números [0.1, 0.2, ...]
          vectorLength: embedding.length,
          textLength: textToEmbed.length,
        })

        console.log(`   ✓ Embedding generado (${embedding.length} dimensiones)`)

        // Pequeño delay para no saturar la API
        await delay(500)
      } catch (error) {
        console.error(`   ✗ Error generando embedding:`, error.message)
        // Continuar con el siguiente post
      }
    }

    // 3. Guardar embeddings en archivo JSON
    console.log(`\n💾 Guardando ${embeddings.length} embeddings en ${OUTPUT_FILE}...`)

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(embeddings, null, 2), 'utf-8')

    console.log(`✅ Archivo guardado exitosamente!`)
    console.log(`\n📊 Resumen:`)
    console.log(`   - Posts procesados: ${embeddings.length}/${posts.length}`)
    console.log(`   - Dimensiones por vector: ${embeddings[0]?.vectorLength || 'N/A'}`)
    console.log(`   - Tamaño del archivo: ${await getFileSize(OUTPUT_FILE)}`)
  } catch (error) {
    console.error('\n❌ Error fatal:', error)
    process.exit(1)
  }
}

/**
 * Utility: Delay en milisegundos
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Utility: Obtener tamaño de archivo
 */
async function getFileSize(filename) {
  try {
    const stats = await fs.stat(filename)
    const bytes = stats.size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } catch {
    return 'N/A'
  }
}

// Ejecutar
main()
