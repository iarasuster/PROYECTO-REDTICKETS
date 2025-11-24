import type { CollectionConfig } from 'payload'
import { analizarTexto } from '../utils/analizarTexto'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Comentario',
    plural: 'Comentarios',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'status', 'sentimentScore', 'createdAt'],
    group: 'Comunidad',
  },
  access: {
    // Todos pueden crear (POST público)
    create: () => true,
    // Solo admin puede leer todos (GET /api/comments necesita filtro por status)
    read: () => true,
    // Solo admin puede actualizar
    update: ({ req: { user } }) => !!user,
    // Solo admin puede eliminar
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      label: 'Autor',
      required: true,
      maxLength: 100,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Comentario',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'sentimentScore',
      type: 'number',
      label: 'Puntuación de Sentimiento',
      admin: {
        description: 'Rango: -1 (negativo) a 1 (positivo)',
        readOnly: true,
      },
    },
    {
      name: 'toxicityScore',
      type: 'number',
      label: 'Puntuación de Toxicidad',
      admin: {
        description: 'Rango: 0 (limpio) a 1 (tóxico)',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'pendiente',
      options: [
        { label: 'Publicado', value: 'publicado' },
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Rechazado', value: 'rechazado' },
      ],
      admin: {
        description: 'Estado de moderación del comentario',
      },
    },
    {
      name: 'eventRef',
      type: 'text',
      label: 'Referencia al Evento (Opcional)',
      admin: {
        description: 'ID o nombre del evento relacionado',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Solo analizar en creación de nuevos comentarios
        if (operation === 'create' && data.comment) {
          try {
            // Analizar el texto del comentario
            const analisis = analizarTexto(data.comment)
            
            // Guardar scores
            data.sentimentScore = analisis.sentiment
            data.toxicityScore = analisis.toxicity
            
            // Determinar status automáticamente
            if (analisis.toxicity > 0.35) {
              // Alta toxicidad → Pendiente de revisión
              data.status = 'pendiente'
            } else if (analisis.sentiment < -0.55 && analisis.toxicity < 0.2) {
              // Muy negativo pero no tóxico → Pendiente de revisión
              data.status = 'pendiente'
            } else {
              // Todo bien → Publicado automáticamente
              data.status = 'publicado'
            }
            
            console.log(`📊 Comentario analizado:`, {
              author: data.author,
              sentiment: analisis.sentiment.toFixed(2),
              toxicity: analisis.toxicity.toFixed(2),
              status: data.status,
            })
          } catch (error) {
            console.error('❌ Error al analizar comentario:', error)
            // Si falla el análisis, dejar pendiente por seguridad
            data.status = 'pendiente'
          }
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
