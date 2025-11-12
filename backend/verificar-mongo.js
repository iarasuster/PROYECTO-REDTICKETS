/**
 * Script para verificar datos en MongoDB
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function verificar() {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    console.log('\n🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conectado');

    const db = client.db();
    const collection = db.collection('contenido-blog');

    console.log('\n📊 Verificando datos...\n');
    
    const docs = await collection.find({}).toArray();
    console.log(`Total documentos: ${docs.length}\n`);

    for (const doc of docs) {
      console.log(`━━━ ${doc.seccion.toUpperCase()} ━━━`);
      console.log(`Título: ${doc.titulo}`);
      
      if (doc.fundadores && doc.fundadores.length > 0) {
        console.log(`✓ Fundadores: ${doc.fundadores.length}`);
        console.log(`  Primero: ${doc.fundadores[0].nombre} - ${doc.fundadores[0].cargo}`);
      }
      
      if (doc.equipo && doc.equipo.length > 0) {
        console.log(`✓ Equipo: ${doc.equipo.length}`);
        console.log(`  Primero: ${doc.equipo[0].nombre} (${doc.equipo[0].area})`);
      }
      
      if (doc.servicios_lista && doc.servicios_lista.length > 0) {
        console.log(`✓ Servicios: ${doc.servicios_lista.length}`);
      }
      
      if (doc.testimonios && doc.testimonios.length > 0) {
        console.log(`✓ Testimonios: ${doc.testimonios.length}`);
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

verificar();
