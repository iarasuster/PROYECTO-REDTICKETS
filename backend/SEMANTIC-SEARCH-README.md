# 🤖 Chatbot Inteligente con Búsqueda Semántica

## 📋 Descripción

Sistema completo de chatbot que integra:

- **PayloadCMS** para gestión de contenido
- **Groq** para embeddings y respuestas inteligentes
- **Búsqueda semántica** con similitud de coseno
- **Generative UI** con acciones dinámicas

## 🏗️ Arquitectura

```
┌─────────────────┐
│  PayloadCMS     │
│  (Posts)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /api/blog-posts│  ◄── 1️⃣ Endpoint que expone posts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│generateEmbeddings│  ◄── 2️⃣ Script que genera vectores
│     .js         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ blogEmbeddings  │  ◄── 3️⃣ Archivo JSON con vectors
│     .json       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ semanticSearch  │  ◄── 4️⃣ Función de búsqueda
│     .js         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /api/chat       │  ◄── 5️⃣ Endpoint del chatbot
│  (con contexto) │
└─────────────────┘
```

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install ai @ai-sdk/groq @ai-sdk/openai
```

### 2. Configurar variables de entorno

Editar `backend/.env`:

```env
# Groq API Key
GROQ_API_KEY=gsk_tu_key_aqui

# URL del blog (para generateEmbeddings.js)
BLOG_API_URL=http://localhost:3000/api/blog-posts

# Modelo de embeddings
CHATBOT_MODEL=llama-3.1-8b-instant
```

---

## 🚀 Uso

### Paso 1: Generar embeddings

Cada vez que agregues o edites posts en PayloadCMS:

```bash
cd backend
node generateEmbeddings.js
```

Esto creará/actualizará `blogEmbeddings.json` con los vectores.

**Salida esperada:**

```
🚀 Iniciando generación de embeddings...

📡 Fetching posts desde: http://localhost:3000/api/blog-posts
✅ Se encontraron 10 posts

[1/10] Procesando: "Cómo comprar entradas online"
   ✓ Embedding generado (1536 dimensiones)
[2/10] Procesando: "Guía para productores de eventos"
   ✓ Embedding generado (1536 dimensiones)
...

💾 Guardando 10 embeddings en blogEmbeddings.json...
✅ Archivo guardado exitosamente!

📊 Resumen:
   - Posts procesados: 10/10
   - Dimensiones por vector: 1536
   - Tamaño del archivo: 245.32 KB
```

### Paso 2: Usar el chatbot con búsqueda semántica

#### Opción A: Usar endpoint con búsqueda semántica

```javascript
// Frontend: Cambiar URL del chat
const CHAT_API = 'http://localhost:3000/api/chat-semantic'
```

#### Opción B: Probar búsqueda directamente

```javascript
// En Node.js o en un test
import { searchPosts } from './src/lib/semanticSearch.js'

const results = await searchPosts('¿Cómo comprar entradas?', 3)
console.log(results)
```

---

## 🔧 Archivos Creados

### 1️⃣ `/api/blog-posts/route.ts`

**Ubicación:** `backend/src/app/api/blog-posts/route.ts`

**Qué hace:**

- Endpoint GET que devuelve todos los posts publicados
- Serializa richText a texto plano
- Formato JSON optimizado para embeddings

**Probar:**

```bash
curl http://localhost:3000/api/blog-posts
```

### 2️⃣ `generateEmbeddings.js`

**Ubicación:** `backend/generateEmbeddings.js`

**Qué hace:**

- Fetch de posts desde la API
- Genera embeddings con Groq (`text-embedding-3-small`)
- Guarda vectores en `blogEmbeddings.json`

**Ejecutar:**

```bash
node generateEmbeddings.js
```

### 3️⃣ `semanticSearch.js`

**Ubicación:** `backend/src/lib/semanticSearch.js`

**Qué hace:**

- Carga embeddings desde JSON
- Genera embedding de la query del usuario
- Calcula similitud de coseno
- Devuelve top K posts relevantes

**Funciones exportadas:**

```javascript
searchPosts(query, topK) // Búsqueda principal
formatContextForChat(results) // Formatea para el chatbot
getContextualAnswer(question, topK) // Todo en uno
```

### 4️⃣ `/api/chat-semantic/route.ts`

**Ubicación:** `backend/src/app/api/chat-semantic/route.ts`

**Qué hace:**

- Recibe pregunta del usuario
- Busca posts relevantes con `semanticSearch`
- Inyecta contexto en el prompt de Groq
- Genera respuesta inteligente con comandos `[ACTION]`
- Stream de respuesta en tiempo real

**Probar:**

```bash
curl -X POST http://localhost:3000/api/chat-semantic \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "¿Cómo comprar entradas?"}]}'
```

---

## 🎯 Ejemplo de Flujo Completo

### 1. Usuario pregunta en el chat

```
Usuario: "¿Cómo puedo comprar entradas para un evento?"
```

### 2. Backend busca posts relevantes

```javascript
// semanticSearch.js encuentra:
;[
  {
    title: 'Guía completa: Cómo comprar entradas',
    similarity: 0.89,
    slug: 'guia-comprar-entradas',
  },
  {
    title: 'Métodos de pago en RedTickets',
    similarity: 0.76,
    slug: 'metodos-pago',
  },
]
```

### 3. Se inyecta contexto en Groq

```
CONTEXTO DEL BLOG:
1. Guía completa: Cómo comprar entradas
   Para comprar entradas en RedTickets: 1) Busca tu evento,
   2) Selecciona entradas, 3) Completa el pago...
   URL: /blog/guia-comprar-entradas

2. Métodos de pago en RedTickets
   Aceptamos tarjetas de crédito, débito, PayPal y más...
   URL: /blog/metodos-pago
```

### 4. Groq genera respuesta con acciones

```
¡Claro! Comprar entradas es muy fácil: busca tu evento,
selecciona tus entradas y completa el pago. Tenemos varios
métodos de pago disponibles.

[ACTION:navigate:guia-comprar-entradas|Leer: Guía completa]
[ACTION:navigate:metodos-pago|Ver métodos de pago]
```

### 5. Frontend renderiza botones

```jsx
<div className="message">
  <p>¡Claro! Comprar entradas es muy fácil...</p>
  <button onClick={() => navigate('/blog/guia-comprar-entradas')}>📖 Leer: Guía completa</button>
  <button onClick={() => navigate('/blog/metodos-pago')}>💳 Ver métodos de pago</button>
</div>
```

---

## 🔄 Mantenimiento

### Actualizar embeddings cuando cambies posts

```bash
# Opción 1: Manual
node generateEmbeddings.js

# Opción 2: Automático (cron job)
# Agregar a crontab para ejecutar diariamente
0 2 * * * cd /path/to/backend && node generateEmbeddings.js
```

### Verificar embeddings existentes

```bash
# Ver cuántos posts tienen embeddings
node -e "console.log(require('./blogEmbeddings.json').length)"

# Ver detalles de un post específico
node -e "console.log(require('./blogEmbeddings.json')[0])"
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module semanticSearch"

```bash
# Verificar que el archivo existe
ls backend/src/lib/semanticSearch.js

# Verificar que package.json tiene "type": "module"
grep "type" backend/package.json
```

### Error: "blogEmbeddings.json not found"

```bash
# Generar embeddings primero
cd backend
node generateEmbeddings.js
```

### Embeddings desactualizados

```bash
# Regenerar todos los embeddings
rm blogEmbeddings.json
node generateEmbeddings.js
```

### Búsqueda devuelve resultados irrelevantes

```javascript
// Ajustar threshold de similitud en semanticSearch.js
const MIN_SIMILARITY = 0.6 // Aumentar para más precisión

// O ajustar topK
const results = await searchPosts(query, 5) // Más resultados
```

---

## 📊 Formato de blogEmbeddings.json

```json
[
  {
    "id": "67890abc",
    "title": "Cómo comprar entradas online",
    "slug": "como-comprar-entradas",
    "excerpt": "Guía paso a paso para comprar...",
    "content": "Para comprar entradas en RedTickets...",
    "autor": "Equipo RedTickets",
    "fecha": "2025-10-15",
    "vector": [0.123, -0.456, 0.789, ...],
    "vectorLength": 1536,
    "textLength": 2450
  }
]
```

---

## 🚀 Próximos Pasos

- [ ] Agregar cache de embeddings en Redis
- [ ] Implementar re-ranking con modelo mayor
- [ ] Agregar filtros (fecha, categoría, autor)
- [ ] Dashboard de analytics de búsquedas
- [ ] A/B testing de modelos de embeddings

---

## 📚 Referencias

- [Groq API Docs](https://console.groq.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Similitud de Coseno](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Embeddings OpenAI](https://platform.openai.com/docs/guides/embeddings)
