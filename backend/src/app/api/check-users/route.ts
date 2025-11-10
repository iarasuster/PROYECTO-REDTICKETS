import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    const users = await payload.find({
      collection: 'users',
      limit: 10,
    })

    return Response.json({
      totalUsers: users.totalDocs,
      users: users.docs.map(u => ({
        id: u.id,
        email: u.email,
        createdAt: u.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error checking users:', error)
    return Response.json({ 
      error: 'Error al verificar usuarios',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
