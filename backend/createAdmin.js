/**
 * Script para crear un usuario administrador en Payload CMS
 * Uso: node createAdmin.js
 */

const readline = require('readline')
const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function createAdmin() {
  console.log('\n🔐 Crear Usuario Administrador en Payload CMS\n')
  console.log('Este script te ayudará a crear un usuario administrador para el panel de Payload.\n')

  try {
    const email = await question('📧 Email del administrador: ')
    const password = await question('🔑 Password (mínimo 8 caracteres): ')

    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido')
      rl.close()
      process.exit(1)
    }

    if (!password || password.length < 8) {
      console.error('❌ Password debe tener al menos 8 caracteres')
      rl.close()
      process.exit(1)
    }

    console.log('\n⏳ Creando usuario administrador...\n')

    // Crear usuario usando el CLI de Payload
    const command = `npm run payload -- create-first-user --email="${email}" --password="${password}"`

    try {
      const { stdout, stderr } = await execPromise(command)
      console.log(stdout)
      if (stderr) console.error(stderr)

      console.log('\n✅ Usuario administrador creado exitosamente!\n')
      console.log('🔗 Ahora puedes iniciar sesión en:')
      console.log('   • Local: http://localhost:3000/admin')
      console.log('   • Producción: https://redtickets-backend.onrender.com/admin')
      console.log('\n📧 Email:', email)
      console.log('🔑 Password: (el que ingresaste)\n')
    } catch (execError) {
      console.error('❌ Error al crear usuario:', execError.message)
      console.log('\n💡 Intenta crear el usuario manualmente:')
      console.log(`   1. Ve a: http://localhost:3000/admin`)
      console.log(`   2. Si no existe ningún usuario, Payload te permitirá crear el primero`)
      console.log(`   3. Ingresa el email y password que desees\n`)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

createAdmin()
