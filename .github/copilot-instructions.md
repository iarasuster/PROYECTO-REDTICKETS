# 🎯 Instrucciones del Proyecto - RedTickets Blog con IA

## Descripción

Blog corporativo headless con Payload CMS, chatbot inteligente con búsqueda semántica y Generative UI. Sistema de gestión de contenido estructurado por secciones con capacidades de IA conversacional.

---

## 🏗️ Arquitectura del Sistema

### Stack Principal

- **Backend**: Payload CMS v3.59 + Next.js 15.4 (App Router)
- **Frontend**: React 18 + Vite 5 + React Router 6
- **Base de datos**: MongoDB Atlas (cloud, con mongoose adapter)
- **IA**: Groq (Llama 3.1-8b-instant) + Vercel AI SDK v5 + OpenAI embeddings
- **Runtime**: Node.js 20.19.5 (usar nvm)
- **Deploy**: Render.com (configurado con `render.yaml`)

### Puertos de Desarrollo

- Backend (Payload + API): `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`
- Frontend: `http://localhost:5173`

### Separación de Responsabilidades

- **Backend** genera **tipos automáticos** (`payload-types.ts`) para TypeScript
- **Frontend** consume API REST pública (sin autenticación requerida para lectura)
- **Payload CMS** auto-genera endpoints REST y GraphQL para todas las collections

---

## 📦 Collections de Payload (Modelos de Datos)

### ContenidoBlog (`contenido-blog`)

**Patrón único**: Un documento = una sección completa del sitio  
**Secciones válidas**: `inicio | sobre_nosotros | servicios | comunidad | ayuda | contacto`

```typescript
// Estructura flexible según sección
{
  seccion: 'sobre_nosotros', // select único (1 doc por sección)
  titulo: 'Sobre Nosotros',
  descripcion: 'Texto intro...',

  // Campos condicionales (admin.condition)
  estadisticas?: { transacciones, eventos_realizados, productores }, // solo 'inicio'
  fundadores?: [{ nombre, cargo }], // solo 'sobre_nosotros'
  equipo?: [{ nombre, area, imagen }],
  eventos?: [{ titulo, fecha, descripcion }], // solo 'comunidad'
  faqs?: [{ pregunta, respuesta }], // solo 'ayuda'
  // ... más campos según sección
}
```

**Ver archivo completo**: [backend/src/collections/ContenidoBlog.ts](backend/src/collections/ContenidoBlog.ts)

### Comments (`comments`)

Sistema de comentarios con **análisis de sentimiento automático**:

- `author`, `comment`, `eventRef` (opcional)
- `sentimentScore` (-1 a 1), `toxicityScore` (0 a 1) - calculados en hook
- `status`: `pendiente | publicado | rechazado`
- Hook `beforeValidate` llama `analizarTexto()` para moderar automáticamente

**Acceso**: Crear=público, leer/actualizar/eliminar=admin only

### Users y Media

- **Users**: Admin con email/password (crear primer usuario en `/admin`)
- **Media**: Gestión de archivos con Sharp para optimización

---

## 🤖 Sistema de Chatbot con IA

### Arquitectura del Chatbot

```
Usuario → ChatUI.jsx (frontend)
         ↓ useStructuredChat hook
         ↓ POST /api/chat-structured (backend)
         ↓ Vercel AI SDK streamText()
         ↓ Groq Llama 3.1-8b-instant
         ↓ Respuesta con formato estructurado
         ↓ Parser en parseStructuredText
         ↓ Renderiza componentes visuales
```

### Endpoint de Chat

#### `/api/chat-structured` - Chat con respuestas estructuradas

- **Flujo**: User message → Groq streamText() → JSON en response body → Frontend parsea y renderiza
- **Arquitectura**: Archetypes (discover/compare/inform/handoff/redirect) + Layers (visual/acknowledge/context/insight/nextSteps)
- **Modelo**: Llama 3.1-8b-instant (rápido, conversacional)
- **Componentes visuales**: CardList, VideoBlock, ImageBlock, ImageGallery
- **Streaming**: Respuestas incrementales con `streamText()` de Vercel AI SDK
- **Ver documentación completa**: [DOCUMENTACION-CHATBOT.md](DOCUMENTACION-CHATBOT.md)

### Generative UI - Arquitectura Actual

**Frontend**: `ChatUI.jsx` con `useStructuredChat.js` hook

**Respuesta JSON del LLM**:

```typescript
{
  archetype: "discover" | "compare" | "inform" | "handoff" | "redirect",
  layers: {
    visual?: VisualBlock[],      // Componentes UI (card-list, video, image, image-gallery)
    acknowledge?: { text },       // Reconocimiento breve de intención
    context?: { text },           // Clarificación adicional (opcional)
    insight?: { text },           // Recomendación humana (opcional)
    nextSteps?: ActionBlock[]     // Botones de acción (navigate/message), máx 3
  }
}
```

**Visual Blocks** (`frontend/src/components/chatbot/`):

- `ImageBlock.jsx` - Imagen única con caption
- `ImageGallery.jsx` - Grid de imágenes (equipo, productos)
- `CardList.jsx` - Lista de servicios/opciones con acciones
- `VideoBlock.jsx` - Video embebido (SOLO existe 1: tutorial de compra)

**Renderizado** (`StructuredChatUI.jsx`):

- Orden: visual → text layers → nextSteps
- Animaciones con CSS transitions
- Estados: `ready | submitting | streaming | error`
- Hook: `useStructuredChat.js` maneja streaming JSON

````

**Visual Blocks** (`frontend/src/components/chatbot/`):
- `ImageBlock.jsx` - Imagen única con caption
- `ImageGallery.jsx` - Grid de imágenes (equipo, productos)
- `CardList.jsx` - Lista de servicios/opciones con acciones
- `VideoBlock.jsx` - Video embebido (SOLO existe 1: tutorial de compra)

**Renderizado** (`ChatUI.jsx`):
- Orden: visual → text layers → nextSteps
- Animaciones con CSS transitions
- Estados: `ready | submitting | streaming | error`
- Hook: `useStructuredChat.js` maneja streaming JSON
- Botones header: Limpiar chat, Maximizar/Minimizar, Cerrar

### Configuración de Modelos

**Groq models disponibles** (todos gratuitos):
- `llama-3.1-8b-instant` - Ultra-rápido, conversacional ✅ (EN USO)
- `llama-3.1-70b-versatile` - Más inteligente, más lento (DESACTIVADO por Groq)
- `llama-3.3-70b-versatile` - Más reciente (no soporta json_schema)
- `mixtral-8x7b-32768` - Contexto largo

**Cambiar modelo**: Editar directamente en `route.ts`:

---

## 🔧 Flujos de Desarrollo Críticos

### 1. Agregar Nueva Sección al Sitio

```typescript
// 1. Backend: ContenidoBlog.ts
{
  name: 'seccion',
  options: [
    // ... existentes
    { label: 'Nueva Sección', value: 'nueva_seccion' }
  ]
}

// 2. Agregar campos condicionales
{
  name: 'campo_especifico',
  type: 'text',
  admin: {
    condition: (data) => data.seccion === 'nueva_seccion'
  }
}

// 3. Frontend: App.jsx
<Route path="/seccion/nueva-seccion" element={<SectionPage />} />

// 4. Admin Panel: Crear documento con seccion='nueva_seccion'
````

### 2. Testing

```bash
# Backend
cd backend

# Tests de integración (Vitest)
npm run test:int          # API + Collections

# Tests E2E (Playwright)
npm run test:e2e          # Frontend en navegador

# Todos los tests
npm run test
```

**Nota**: Tests configurados en `vitest.config.mts` y `playwright.config.ts`

### 3. Cargar Contenido Inicial

```bash
cd backend
npm run seed  # Ejecuta seed-contenido.js
```

**Script** (`seed-contenido.js`):

- Carga datos JSON estructurados para todas las secciones
- Crea documentos en `contenido-blog` con Payload Local API
- Útil para reset de base de datos o datos de demo

---

## 🚀 Deploy y CI/CD

### Configuración con render.yaml

**Blueprint automático** para Render.com:

- **Backend**: Web Service con Node 20.19.5, build+start scripts
- **Frontend**: Static Site con cache headers y SPA rewrites
- **Env vars**: `DATABASE_URI`, `GROQ_API_KEY` deben configurarse manualmente

```bash
# Deploy desde GitHub
git push origin main
# Render detecta cambios y re-deploys automáticamente
```

**Ver guía completa**: [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)

### Variables de Entorno Críticas

**Backend** (`.env`):

```env
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=$(openssl rand -base64 32)
GROQ_API_KEY=gsk_...
NODE_ENV=development
```

**Frontend** (`.env`):

```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_API_URL=http://localhost:3000/api/chat
VITE_ENABLE_AI_CHAT=true
```

---

## 🎨 Patrones y Convenciones

### API de Payload (Auto-generadas)

```javascript
// Queries con filtros
GET /api/contenido-blog?where={"seccion":{"equals":"inicio"}}

// Paginación
GET /api/contenido-blog?page=1&limit=10

// Ordenamiento
GET /api/contenido-blog?sort=-createdAt

// Profundidad (populate relations)
GET /api/contenido-blog?depth=2
```

### CORS Pre-configurado

Payload permite múltiples origins (ver `payload.config.ts`):

- Localhost ports: 3000, 3001, 5173, 5174
- Vercel preview deployments: wildcards via `cors: '*'`
- CSRF protection con lista explícita

### Análisis de Texto (Comments)

**Hook automático** en `Comments.ts`:

```typescript
beforeValidate: async ({ data, req }) => {
  const analisis = await analizarTexto(data.comment);
  data.sentimentScore = analisis.sentimiento;
  data.toxicityScore = analisis.toxicidad;
  data.status = analisis.toxicidad > 0.5 ? "rechazado" : "pendiente";
};
```

**Implementación**: Usa análisis heurístico en `backend/src/utils/analizarTexto.ts`

---

## 📚 Scripts Útiles

### Backend

```bash
npm run dev                    # Next.js dev con Payload
npm run devsafe                # Limpia .next y reinicia
npm run generate:types         # Genera payload-types.ts
npm run generate:importmap     # Genera admin importMap
npm run seed                   # Carga contenido inicial
npm run test                   # Tests int + e2e
```

### Frontend

```bash
npm run dev                    # Vite dev server
npm run build                  # Build producción
npm run preview                # Preview del build
```

---

## ⚠️ Problemas Comunes

### "Cannot connect to MongoDB"

→ Verificar `DATABASE_URI` en `.env` (incluir `/database?retryWrites=true&w=majority`)

### "Groq API error" en chatbot

→ Verificar `GROQ_API_KEY` válida en backend (obtener en console.groq.com)

### Posts no aparecen en frontend

→ Verificar que `seccion` en admin panel coincida exactamente con valores en select

### Admin Panel redirige a login infinito

→ Regenerar `PAYLOAD_SECRET`: `openssl rand -base64 32`

### Frontend no conecta con backend en deploy

→ Verificar `VITE_API_URL` apunta a backend desplegado (no localhost)

---

## 🔐 Seguridad

- ✅ **Next.js 15.4.8** - Patch CVE-2025-66478
- ✅ **React 19.1.2** - Patch CVE-2025-55182
- ✅ **Payload 3.59.1** - Última versión estable
- ✅ **Análisis de toxicidad** automático en comentarios
- ✅ **CSRF tokens** configurados para dominios específicos

---

## 📖 Referencias

- [Payload CMS Docs](https://payloadcms.com/docs) - Collections, hooks, auth
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - streamText, useChat patterns
- [Groq Cloud](https://console.groq.com/docs) - Modelos y rate limits
- [OpenAI Guidelines](https://platform.openai.com/docs/guides/prompt-engineering) - Diseño de prompts
