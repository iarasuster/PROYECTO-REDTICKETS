import { NextResponse } from 'next/server'

/**
 * Health check para el chat
 * GET /api/chat/health
 */
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    groq_api_key: process.env.GROQ_API_KEY ? 'configured' : 'missing',
    node_version: process.version,
  }

  console.log('🔍 Health check:', health)
  
  return NextResponse.json(health)
}
