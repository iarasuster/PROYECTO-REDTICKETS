#!/usr/bin/env node
/**
 * Wrapper para ejecutar seed-contenido.js con soporte TypeScript
 * Usa el mismo approach de Next.js para cargar archivos .ts
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const seedScript = join(__dirname, '..', 'seed-contenido.js')

// Ejecutar con las mismas opciones que Next.js usa
const child = spawn('node', [
  '--no-deprecation',
  '--import',
  'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("next/dist/server/node-polyfill-modules.js", pathToFileURL("./"));',
  seedScript
], {
  stdio: 'inherit',
  cwd: join(__dirname, '..'),
  env: process.env
})

child.on('exit', (code) => {
  process.exit(code || 0)
})
