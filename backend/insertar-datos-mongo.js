/**
 * Script para insertar datos directamente en MongoDB
 * Ejecutar con: node insertar-datos-mongo.js
 */

import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env') })

// Helper para generar IDs únicos para items de arrays
const generateId = () => new ObjectId().toString()

const contenido = [
  {
    seccion: 'inicio',
    titulo: 'Creamos experiencias, gestionamos momentos.',
    descripcion:
      'En RedTickets acompañamos a productores, artistas y marcas a conectar con su público.',
    estadisticas: {
      transacciones: 4000000,
      eventos_realizados: 20000,
      productores: 500,
    },
    fundadores: [],
    equipo: [],
    servicios_lista: [],
    testimonios: [],
    como_comprar: { introduccion: '', pasos: [] },
    recepcion_tickets: { descripcion: '', instrucciones: [] },
    como_vender: { introduccion: '', pasos: [] },
    formulario: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seccion: 'sobre_nosotros',
    titulo: 'Más que una ticketera.',
    descripcion:
      'Nos gusta festejar, reunirnos, emocionarnos. Desde 2015 trabajamos para que cada evento sea una experiencia fluida, segura y memorable.',
    estadisticas: { transacciones: null, eventos_realizados: null, productores: null },
    fundadores: [
      { id: generateId(), nombre: 'Sebastián Pérez Volpe', cargo: 'Máster en Marketing Digital' },
      {
        id: generateId(),
        nombre: 'Carlos Fleurquin',
        cargo: 'Licenciado en Administración y emprendedor',
      },
      { id: generateId(), nombre: 'Rafael Ordoñez', cargo: 'Director Creativo y Diseñador Senior' },
      { id: generateId(), nombre: 'Bernardo Ponce de León', cargo: 'Contador Público y CFO' },
    ],
    equipo: [
      {
        id: generateId(),
        nombre: 'Dani',
        area: 'Desarrollo',
        detalle: 'Sabe hacer buen pancito, dudamos que sepa algo más.',
      },
      {
        id: generateId(),
        nombre: 'Fabri',
        area: 'Programación',
        detalle: 'Todos quieren algo de él, pobrecito.',
      },
      {
        id: generateId(),
        nombre: 'Rochi',
        area: 'Comercial',
        detalle: 'Nuestra astróloga de cabecera.',
      },
      {
        id: generateId(),
        nombre: 'Sofi',
        area: 'Comercial',
        detalle: 'La más antigua del equipo, la más compañera.',
      },
      {
        id: generateId(),
        nombre: 'Fran',
        area: 'Comercial',
        detalle: 'El más charlatán, pero también el que tira más para adelante.',
      },
      { id: generateId(), nombre: 'Emi', area: 'Desarrollo', detalle: '' },
      { id: generateId(), nombre: 'Cami', area: 'Marketing', detalle: '' },
      {
        id: generateId(),
        nombre: 'Marchu',
        area: 'Administración',
        detalle: 'Vive lejitos pero siempre la tenemos cerca.',
      },
      { id: generateId(), nombre: 'Vale', area: 'Comercial', detalle: '' },
      { id: generateId(), nombre: 'Fede', area: 'Atención al cliente', detalle: '' },
      { id: generateId(), nombre: 'Cami', area: 'Administración', detalle: '' },
      { id: generateId(), nombre: 'Lolo', area: 'Comercial', detalle: '' },
      { id: generateId(), nombre: 'Agus', area: 'Atención al cliente', detalle: '' },
      { id: generateId(), nombre: 'Fabi', area: 'Atención al cliente', detalle: '' },
    ],
    servicios_lista: [],
    testimonios: [],
    como_comprar: { introduccion: '', pasos: [] },
    recepcion_tickets: { descripcion: '', instrucciones: [] },
    como_vender: { introduccion: '', pasos: [] },
    formulario: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seccion: 'servicios',
    titulo: 'Nuestros Servicios',
    descripcion:
      'Soluciones integrales para eventos de todo tipo. Ofrecemos acompañamiento personalizado y herramientas flexibles para productores, marcas y artistas.',
    estadisticas: { transacciones: null, eventos_realizados: null, productores: null },
    fundadores: [],
    equipo: [],
    servicios_lista: [
      {
        id: generateId(),
        servicio: 'Venta y gestión de entradas: crear, vender, controlar y liquidar.',
      },
      {
        id: generateId(),
        servicio:
          'Compra de entradas: múltiples medios de pago, tanto locales como internacionales.',
      },
      {
        id: generateId(),
        servicio:
          'APP RedTickets: permite comprar tickets, acceder a la billetera y recibir notificaciones.',
      },
      { id: generateId(), servicio: 'Diseño de e-ticket personalizado.' },
      { id: generateId(), servicio: 'Hard Ticketing: impresión y suministro de entradas físicas.' },
      {
        id: generateId(),
        servicio:
          'Control de acceso: personal capacitado, software propio y aplicación ControlTickets.',
      },
      {
        id: generateId(),
        servicio:
          'Configuración avanzada: descuentos, promociones, códigos de acceso y límites de compra.',
      },
      { id: generateId(), servicio: 'Integración con sistemas de control de acceso.' },
      { id: generateId(), servicio: 'Atención al cliente los 7 días de la semana.' },
      { id: generateId(), servicio: 'Ticket Seguro (MetLife): seguro asociado a las entradas.' },
      {
        id: generateId(),
        servicio: 'Sistema propio de acreditaciones: etiquetas personalizadas y credenciales.',
      },
    ],
    testimonios: [],
    como_comprar: { introduccion: '', pasos: [] },
    recepcion_tickets: { descripcion: '', instrucciones: [] },
    como_vender: { introduccion: '', pasos: [] },
    formulario: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seccion: 'comunidad',
    titulo: 'Nuestra Comunidad',
    descripcion:
      'Lo mejor de RedTickets está en quienes confían en nosotros. Cada evento cuenta una historia.',
    estadisticas: { transacciones: null, eventos_realizados: null, productores: null },
    fundadores: [],
    equipo: [],
    servicios_lista: [],
    testimonios: [
      {
        id: generateId(),
        texto:
          'La atención fue impecable y la plataforma nos permitió vender entradas sin complicaciones.',
        autor: 'Festival Independiente Montevideo',
      },
    ],
    como_comprar: { introduccion: '', pasos: [] },
    recepcion_tickets: { descripcion: '', instrucciones: [] },
    como_vender: { introduccion: '', pasos: [] },
    formulario: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seccion: 'ayuda',
    titulo: '¿Tenés dudas? Estamos para ayudarte.',
    descripcion: 'Preguntas frecuentes sobre cómo comprar y vender tickets.',
    estadisticas: { transacciones: null, eventos_realizados: null, productores: null },
    fundadores: [],
    equipo: [],
    servicios_lista: [],
    testimonios: [],
    como_comprar: {
      introduccion: 'Comprar tus tickets es muy fácil en RedTickets.',
      pasos: [
        { id: generateId(), titulo: 'Paso 1', detalle: 'Seleccionar el evento en redtickets.uy' },
        { id: generateId(), titulo: 'Paso 2', detalle: 'Determinar cantidad y tipo de tickets' },
        { id: generateId(), titulo: 'Paso 3', detalle: 'Seleccionar medio de pago' },
        { id: generateId(), titulo: 'Paso 4', detalle: 'Recibir tickets por email' },
      ],
    },
    recepcion_tickets: {
      descripcion: 'Recibirás un PDF por cada entrada.',
      instrucciones: [
        { id: generateId(), paso: 'Iniciá sesión en tu cuenta' },
        { id: generateId(), paso: 'Hacé clic en tu nombre' },
        { id: generateId(), paso: 'Entrá a Mis Tickets' },
        { id: generateId(), paso: 'Descargá o imprimí' },
      ],
    },
    como_vender: {
      introduccion: 'Plataforma completa para gestionar ventas.',
      pasos: [
        { id: generateId(), titulo: 'Paso 1', detalle: 'Crear evento en redtickets.net' },
        { id: generateId(), titulo: 'Paso 2', detalle: 'Promocionar con URL única' },
        { id: generateId(), titulo: 'Paso 3', detalle: 'Seguir ventas en tiempo real' },
        { id: generateId(), titulo: 'Paso 4', detalle: 'Controlar acceso con app' },
        { id: generateId(), titulo: 'Paso 5', detalle: 'Recibir liquidación' },
      ],
    },
    formulario: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    seccion: 'contacto',
    titulo: 'Contacto',
    descripcion: '¿Querés organizar un evento con RedTickets?',
    estadisticas: { transacciones: null, eventos_realizados: null, productores: null },
    fundadores: [],
    equipo: [],
    servicios_lista: [],
    testimonios: [],
    como_comprar: { introduccion: '', pasos: [] },
    recepcion_tickets: { descripcion: '', instrucciones: [] },
    como_vender: { introduccion: '', pasos: [] },
    email: 'hola@redtickets.uy',
    telefono: '+598 94 636 018',
    formulario: [
      { id: generateId(), campo: 'Nombre / Empresa' },
      { id: generateId(), campo: 'Correo electrónico' },
      { id: generateId(), campo: 'País' },
      { id: generateId(), campo: 'Tipo de consulta' },
      { id: generateId(), campo: 'Mensaje' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function main() {
  const client = new MongoClient(process.env.DATABASE_URI)

  try {
    console.log('\n🔌 Conectando a MongoDB...')
    await client.connect()
    console.log('✅ Conectado')

    const db = client.db()
    // Payload prefija las colecciones con el nombre de la DB
    const collection = db.collection('contenido-blog')

    console.log('\n🗑️  Eliminando documentos existentes...')
    const deleteResult = await collection.deleteMany({})
    console.log(`✅ Eliminados: ${deleteResult.deletedCount} documentos`)

    console.log('\n📝 Insertando datos...')
    const insertResult = await collection.insertMany(contenido)
    console.log(`✅ Insertados: ${insertResult.insertedCount} documentos`)

    console.log('\n✅ ¡Datos cargados exitosamente!')
    console.log('\n📊 Resumen:')
    contenido.forEach((doc) => {
      console.log(`  - ${doc.seccion}: ${doc.titulo}`)
    })

    console.log('\n🎯 Ahora recargá el frontend (F5) para ver los cambios!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

main()
