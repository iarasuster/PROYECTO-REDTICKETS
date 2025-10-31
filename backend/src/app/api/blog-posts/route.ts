/**
 * ENDPOINT: /api/blog-posts
 * 
 * Devuelve todos los posts del blog para generar embeddings
 * o consultas del chatbot.
 * 
 * Uso: fetch('http://localhost:3000/api/blog-posts')
 */

import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async () => {
  try {
    // Obtener instancia de Payload
    const payload = await getPayload({ config })

    // Buscar todos los posts publicados
    const posts = await payload.find({
      collection: 'posts',
      where: {
        publicado: {
          equals: true,
        },
      },
      limit: 1000,
      depth: 0,
    })

    // Transformar posts a formato simplificado
    const simplifiedPosts = posts.docs.map((post: any) => ({
      id: post.id,
      title: post.titulo || 'Sin título',
      slug: post.slug || '',
      excerpt: post.extracto || '',
      content: serializeRichText(post.contenido),
      autor: post.autor || '',
      fecha: post.fecha || null,
    }))

    return Response.json({
      success: true,
      total: simplifiedPosts.length,
      posts: simplifiedPosts,
    })

  } catch (error) {
    console.error('❌ Error en /api/blog-posts:', error)
    
    return Response.json({
      success: false,
      error: 'Error al obtener posts',
    }, { status: 500 })
  }
}

/**
 * Serializa richText de Payload a texto plano
 */
function serializeRichText(richText: any): string {
  if (!richText) return ''
  
  if (Array.isArray(richText)) {
    return richText
      .map((node) => extractText(node))
      .filter(Boolean)
      .join('\n\n')
  }

  if (typeof richText === 'string') return richText
  if (richText?.root?.children) return extractText(richText.root.children)
  
  return String(richText)
}

/**
 * Extrae texto recursivamente de nodos
 */
function extractText(node: any): string {
  if (!node) return ''
  if (node.text) return node.text
  
  if (Array.isArray(node)) {
    return node.map(extractText).filter(Boolean).join(' ')
  }
  
  if (node.children) {
    return extractText(node.children)
  }
  
  return ''
}
