/**
 * Interceptar peticiones a /api/media/file/* y redirigir a Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  try {
    const payload = await getPayload({ config })
    
    // Buscar el archivo en la collection media por filename
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const media = result.docs[0]
    
    // Si tiene URL de Cloudinary, redirigir
    if (media.url && media.url.includes('cloudinary.com')) {
      return NextResponse.redirect(media.url, 302)
    }

    // Si no, error
    return NextResponse.json(
      { error: 'Cloudinary URL not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
