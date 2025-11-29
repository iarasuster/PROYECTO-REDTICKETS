import { getPayload } from 'payload'
import config from './src/payload.config.ts'

const actualizarDatosImportantes = async () => {
  try {
    console.log('🔄 Iniciando actualización de Datos Importantes...')

    const payload = await getPayload({ config })

    // Buscar el documento de ayuda
    const resultado = await payload.find({
      collection: 'contenido-blog',
      where: {
        seccion: {
          equals: 'ayuda',
        },
      },
      limit: 1,
    })

    if (resultado.docs.length === 0) {
      console.error('❌ No se encontró el documento de ayuda')
      process.exit(1)
    }

    const docAyuda = resultado.docs[0]
    console.log('✅ Documento de ayuda encontrado:', docAyuda.id)

    // Actualizar con los nuevos Datos Importantes
    await payload.update({
      collection: 'contenido-blog',
      id: docAyuda.id,
      data: {
        datos_importantes: {
          faqs: [
            {
              pregunta: '¿Cómo recibo mis tickets?',
              respuesta: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Una vez que la compra se haya confirmado, recibirás un correo electrónico con un archivo PDF por entrada.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Además del correo, en cualquier momento puedes ingresar en RedTickets con el mail de compra y contraseña, entrar en tu menú de usuario (clickeando tu nombre) y dirigirte a «Mis Tickets». Allí encontrarás todos tus tickets, incluso los de los eventos pasados. Los puedes descargar, imprimir o guardar en tu teléfono.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Nota: el ticket se mostrará como un PDF en una ventana externa. Debes permitir las ventanas emergentes en tu navegador.',
                      bold: true,
                    },
                  ],
                },
              ],
            },
            {
              pregunta: '¿Qué debo llevar para poder entrar el día del evento?',
              respuesta: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Para ingresar al evento puedes imprimir tu entrada o guardar el código en tu smartphone.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'De esta forma la persona responsable del acceso podrá escanear tu entrada. Ten en cuenta que cada código es único, y no podrás pasar dos veces con el mismo código, por lo que te recomendamos seas prudente con el mismo.',
                    },
                  ],
                },
              ],
            },
            {
              pregunta: '¿Qué pasa si el evento se cancela?',
              respuesta: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'La producción del evento es responsabilidad del organizador.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Si el mismo se cancelara, se reintegrará el importe de las entradas. Nos comunicaremos por medio del correo electrónico con el que te hayas registrado en RedTickets para informarte de la forma en el que se realizará.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    })

    console.log('✅ Datos Importantes actualizados correctamente')
    console.log('📋 Se agregaron 3 FAQs:')
    console.log('   1. ¿Cómo recibo mis tickets?')
    console.log('   2. ¿Qué debo llevar para poder entrar el día del evento?')
    console.log('   3. ¿Qué pasa si el evento se cancela?')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al actualizar:', error)
    process.exit(1)
  }
}

actualizarDatosImportantes()
