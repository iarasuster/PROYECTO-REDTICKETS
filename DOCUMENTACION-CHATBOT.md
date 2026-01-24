# 🤖 Documentación del Chatbot - RedTickets

Sistema de chatbot con IA conversacional que usa formato de texto estructurado para respuestas dinámicas con componentes visuales. Compatible con Groq free tier (llama-3.1-8b-instant).

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Stack Técnico](#stack-técnico)
3. [Flujo de Mensajes](#flujo-de-mensajes)
4. [Arquetipos y Capas](#arquetipos-y-capas)
5. [Componentes Visuales](#componentes-visuales)
6. [Estructura de Archivos](#estructura-de-archivos)
7. [Configuración](#configuración)
8. [Reglas de Negocio](#reglas-de-negocio)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🏗️ Arquitectura General

```
Usuario escribe mensaje
         ↓
ChatUI.jsx (componente flotante)
         ↓
useStructuredChat hook
         ↓
POST /api/chat-structured
         ↓
Payload CMS (cache 5 min) → Contexto del sitio
         ↓
Groq API (Llama 3.1-8b-instant)
         ↓
Respuesta TEXTO ESTRUCTURADO (streaming)
         ↓
Parser de texto en frontend (parseStructuredText.js)
         ↓
Renderiza componentes visuales
```

### Principios de Diseño

1. **Separation of Concerns**: Backend retorna texto estructurado, frontend parsea y renderiza UI
2. **Formato de Texto**: Usa formato legible (ARCHETYPE/MESSAGE/VISUAL/ACTIONS) en lugar de JSON estricto
3. **Compatible con Groq**: Formato optimizado para Groq free tier (más tolerante que JSON puro)
4. **Streaming**: Respuestas incrementales con parsing progresivo
5. **Conectado a CMS**: Todo el contenido viene de Payload, no hardcodeado

---

## 🛠️ Stack Técnico

### Backend

- **Framework**: Next.js 15.4.8 (App Router)
- **CMS**: Payload CMS 3.59.1
- **Database**: MongoDB Atlas
- **AI**: Groq API (llama-3.1-8b-instant)
- **AI SDK**: Vercel AI SDK v5 (`streamText`)
- **Runtime**: Node.js 20.19.5

### Frontend

- **Framework**: React 18.2 + Vite 5.4
- **Router**: React Router 6.30
- **Styling**: CSS modular
- **State**: React Hooks

### Puertos

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

---

## 🔄 Flujo de Mensajes

### 1. Usuario Envía Mensaje

```javascript
// ChatUI.jsx
sendMessage("¿Qué servicios ofrecen?");
```

### 2. Hook Procesa Request

```javascript
// useStructuredChat.js
const handleSubmit = async (messageText) => {
  // Agregar mensaje del usuario
  setMessages([...messages, { role: "user", content: messageText }]);

  // Filtrar mensajes: solo user messages y assistant layers.message
  const apiMessages = messages
    .filter(
      (m) => m.role === "user" || (m.role === "assistant" && m.layers?.message),
    )
    .map((m) => ({
      role: m.role,
      content: m.role === "user" ? m.content : m.layers.message,
    }));

  // Llamar al endpoint
  const response = await fetch("/api/chat-structured", {
    method: "POST",
    body: JSON.stringify({ messages: apiMessages }),
  });

  // Parsear texto estructurado streaming
  parseStreamingText(response.body);
};
```

### 3. Backend Obtiene Contexto

```typescript
// route.ts - getContentData()
const contentData = await getPayloadContent(); // Cache 5 min
// Retorna: secciones, equipo, servicios, video_tutorial
```

### 4. Groq Genera Respuesta

```typescript
// route.ts
const result = await streamText({
  model: groq("llama-3.1-8b-instant"),
  system: SYSTEM_PROMPT, // Reglas + ejemplos
  messages: [
    { role: "system", content: contextPrompt }, // Contenido del sitio
    ...userMessages,
  ],
  temperature: 0.7,
  maxTokens: 800,
});
```

**SYSTEM_PROMPT incluye**:

- Definición de arquetipos (discover, inform, handoff, redirect) ⚠️ SOLO 4
- Estructura de texto: ARCHETYPE / MESSAGE / VISUAL / ACTIONS
- Ejemplos completos de cada tipo de respuesta
- Reglas estrictas (no repetir preguntas, no inventar datos, NUNCA JSON)

### 5. Frontend Renderiza

```jsx
// ChatUI.jsx - Renderiza bloques visuales si existen
{
  message.layers.visual && renderVisualBlocks(message.layers.visual);
}

// Renderiza mensaje de texto
{
  message.layers.message && <div>{message.layers.message}</div>;
}

// Renderiza botones de acción
{
  message.layers.actions &&
    message.layers.actions.map((action) => (
      <button onClick={() => handleAction(action)}>{action.label}</button>
    ));
}
```

```

---

## 🎯 Arquetipos y Capas

### Arquetipos

Clasifican la **intención** del usuario:

| Arquetipo    | Cuándo Usar                  | Ejemplo                        |
| ------------ | ---------------------------- | ------------------------------ |
| **discover** | Usuario explorando opciones  | "¿Qué servicios ofrecen?"      |
| **inform**   | Pregunta específica o saludo | "¿Cuántos eventos realizaron?" |
| **handoff**  | Usuario listo para acción    | "¿Cómo compro entradas?"       |
| **redirect** | Fuera de alcance             | "¿Cuál es el clima?"           |

⚠️ **IMPORTANTE**: Estos son los ÚNICOS arquetipos válidos. Cualquier otro valor hace fallback a `inform`.

### Capas (Layers)

Componen la **respuesta** en formato de texto estructurado:

```

ARCHETYPE: discover

MESSAGE:
[Texto de respuesta principal]

VISUAL:
[Componentes visuales opcionales: CARDS, VIDEO]

ACTIONS:
[Botones de navegación, máximo 3]

---

```

**Campos**:

- `MESSAGE` - REQUERIDO - Texto de respuesta
- `VISUAL` - OPCIONAL - CARDS o VIDEO
- `ACTIONS` - OPCIONAL - Botones (máx 3)

```

#### Orden de Renderizado

1. **VISUAL** - Primero (CARDS o VIDEO)
2. **MESSAGE** - Texto principal
3. **ACTIONS** - Botones de acción

#### Cuándo Usar Cada Sección

| Sección     | Cuándo Incluir                     | Cuándo Omitir           |
| ----------- | ---------------------------------- | ----------------------- |
| **MESSAGE** | SIEMPRE - Nunca vacío              | Nunca omitir            |
| **VISUAL**  | discover, handoff con video/cards  | inform simple, redirect |
| **ACTIONS** | Cuando hay acciones claras (máx 3) | Saludos simples         |

---

## 🎨 Componentes Visuales

### 1. CardList

**Uso**: Listar servicios, opciones, productos

```

VISUAL:
CARDS: Gestión de Eventos | Organizamos tu evento completo | servicios
CARDS: Venta de Tickets | Plataforma segura de venta online | servicios
CARDS: Control de Acceso | Seguridad y validación profesional | servicios

```

**Renderiza**: Grid de cards clickeables con navegación

### 2. VideoBlock

**Uso**: Tutorial de compra de entradas

```

VISUAL:
VIDEO: https://www.youtube.com/embed/SfHuVUmpzgU | Cómo comprar entradas paso a paso

```

⚠️ **CRÍTICO**: Solo existe 1 video en todo el sistema (tutorial de compra). NUNCA inventar videos para otros temas.

### 3. Acciones (ACTIONS)

#### Navigate

Navega a una sección del sitio:

```

ACTIONS:
Ver Servicios → servicios (navigate)
Conocer Equipo → sobre-nosotros (navigate)
Contactar → contacto (navigate)

```

**Secciones válidas**: `inicio`, `sobre-nosotros`, `servicios`, `comunidad`, `ayuda`, `contacto`

**Tabs específicas en Ayuda**:

- `ayuda?tab=comprar` - Cómo Comprar
- `ayuda?tab=vender` - Cómo Vender
- `ayuda?tab=datos` - Datos Importantes
- `ayuda?tab=politicas` - Políticas
- `ayuda?tab=devoluciones` - Devoluciones
- `ayuda?tab=tecnica` - Ayuda Técnica (tótem)

#### Message

Envía mensaje predefinido al chat:

```

ACTIONS:
Hablar con asesor → Quiero contactar con un asesor (message)

```

---

## 📁 Estructura de Archivos

### Backend

```

backend/src/app/api/
├── chat-structured/
│ └── route.ts # Endpoint principal del chatbot
│
backend/src/
├── collections/
│ └── ContenidoBlog.ts # Collection con contenido del sitio
└── utils/
└── analizarTexto.ts # Análisis de sentimiento (comments)

```

**`route.ts`** (~440 líneas):

- `getContentData()` - Fetch de Payload con cache
- `SYSTEM_PROMPT` - Instrucciones + ejemplos para el LLM
- `POST()` - Handler principal con `streamText()`

### Frontend

```

frontend/src/
├── components/
│ ├── ChatUI.jsx # Componente principal del chat
│ ├── ChatUI.css
│ ├── chatbot/
│ │ ├── CardList.jsx
│ │ ├── VideoBlock.jsx
│ │ ├── SuggestedActions.jsx # Sugerencias iniciales
│ │ └── VisualBlocks.css
│ └── Chatbot.jsx # Botón flotante que abre ChatUI
│
├── hooks/
│ └── useStructuredChat.js # Hook de gestión de estado
│
├── utils/
│ └── parseStructuredText.js # Parser de texto estructurado
│
└── services/
└── api.js # Configuración de API

```

**`ChatUI.jsx`** (~340 líneas):

- Estados: messages, input, isMaximized
- Funciones: renderVisualBlocks (CARDS y VIDEO)
- Renderizado directo: MESSAGE (texto), ACTIONS (botones)
- Botones header: Limpiar, Maximizar, Cerrar

**`useStructuredChat.js`** (~245 líneas):

- Manejo de streaming de texto estructurado
- Usa parseStructuredText() para parsear respuestas
- Filtrado de mensajes: user content + assistant layers.message
- Estados: ready, submitting, streaming, error

**`parseStructuredText.js`** (~115 líneas):

- Parser tolerante para formato ARCHETYPE/MESSAGE/VISUAL/ACTIONS
- Extrae archetype con fallback a "inform"
- Parsea CARDS y VIDEO con regex flexible
- Prioridad: VIDEO > CARDS (no mezclar)
- Máximo 3 acciones

---

## ⚙️ Configuración

### Variables de Entorno

**Backend** (`backend/.env`):

```env
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=<generar con openssl rand -base64 32>
GROQ_API_KEY=gsk_...
NODE_ENV=development
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_API_URL=http://localhost:3000/api/chat-structured
VITE_ENABLE_AI_CHAT=true
```

### Obtener API Key de Groq

1. Ir a [console.groq.com](https://console.groq.com)
2. Crear cuenta / iniciar sesión
3. API Keys → Create API Key
4. Copiar clave y agregar a `.env`

**Límites gratuitos**: Generoso, suficiente para desarrollo y producción pequeña

### Configuración del Modelo

En `route.ts`:

```typescript
model: groq('llama-3.1-8b-instant'), // Rápido, conversacional
temperature: 0.7,                     // Balance creatividad/precisión
maxTokens: 800                        // Limitar respuestas muy largas
```

**Modelos disponibles en Groq**:

- `llama-3.1-8b-instant` - Ultra rápido ✅ (EN USO)
- `llama-3.1-70b-versatile` - Más inteligente (DESACTIVADO por Groq)
- `llama-3.3-70b-versatile` - Más reciente (no soporta json_schema)
- `mixtral-8x7b-32768` - Contexto largo

---

## 📜 Reglas de Negocio

### Reglas Críticas del Prompt

1. **SIEMPRE responde con TEXTO ESTRUCTURADO**: Usar formato `ARCHETYPE / MESSAGE / VISUAL / ACTIONS`. NUNCA JSON. Nunca quedarse en silencio
2. **NUNCA repitas la pregunta del usuario**: Responde directamente
3. **NUNCA inventes valores en navigate**: Solo las 6 secciones válidas
4. **Para eventos/artistas**: "Los eventos se compran en RedTickets.uy" + botón a comunidad/contacto
5. **Para "cómo se vende"**: Redirige a "ayuda" (paso a paso real) + contacto
6. **NO inventes datos**: Si no sabes, di que no sabes y ofrece alternativas
7. **NO uses emojis**: Mantén tono profesional
8. **NO agregues nextSteps en saludos**: Solo en acciones concretas
9. **Respuestas CORTAS**: 1-2 oraciones máximo por layer
10. **Video SOLO para "cómo comprar"**: NO para "cómo vender" ni otros temas

### Decisión de Diseño

> **¿Por qué un solo bloque de texto (`MESSAGE`) en lugar de múltiples capas semánticas?**
>
> El sistema usa un único campo de texto (`MESSAGE`) en lugar de capas como `acknowledge`, `context`, `insight`.
> Esto reduce errores de parsing, simplifica el prompt y mejora la estabilidad con modelos LLM en streaming.
> Es una **elección consciente**, no una limitación.

### Manejo de Casos Especiales

#### Pregunta sobre evento específico

```
Usuario: "Quiero ver a Shakira"
✅ Correcto: Informar que eventos se publican en RedTickets.uy + botones ACTIONS
❌ Incorrecto: Inventar fechas/información del evento
```

#### Pregunta sobre vender entradas

```
Usuario: "¿Cómo vendo entradas?"
✅ Correcto: Redirigir a "ayuda?tab=vender" (paso a paso) + contacto
❌ Incorrecto: Mostrar video (no existe) o crear botones inventados
```

#### Pregunta fuera de alcance

```
Usuario: "¿Cuál es el clima?"
✅ Correcto: archetype "redirect" + explicar especialización + botones ACTIONS útiles
❌ Incorrecto: Intentar responder o decir "no sé" sin alternativas
```

#### Saludo simple

```
Usuario: "Hola"
✅ Correcto: MESSAGE simple, SIN ACTIONS
❌ Incorrecto: Agregar botones innecesarios
```

---

## 🧪 Testing

### Queries de Prueba

#### 1. Discover (debería retornar CardList)

```
"¿Qué servicios ofrecen?"
"¿Qué hacen en RedTickets?"
```

**Esperado**:

```
ARCHETYPE: discover

MESSAGE:
Ofrecemos servicios completos de ticketing para eventos...

VISUAL:
CARDS: Gestión de Eventos | ... | servicios
CARDS: Venta de Tickets | ... | servicios

ACTIONS:
Ver Todos → servicios (navigate)
---
```

#### 2. Inform (debería retornar texto simple)

```
"¿Cuántos eventos han realizado?"
"¿Quiénes son el equipo?"
```

**Esperado**:

```
ARCHETYPE: inform

MESSAGE:
Hemos realizado más de 8,000 eventos exitosos...

ACTIONS:
Conocer Equipo → sobre-nosotros (navigate)
---
```

#### 3. Handoff con Video

```
"¿Cómo compro entradas?"
"¿Proceso de compra?"
```

**Esperado**:

```
ARCHETYPE: handoff

MESSAGE:
Puedes comprar entradas siguiendo estos pasos...

VISUAL:
VIDEO: https://www.youtube.com/embed/SfHuVUmpzgU | Tutorial de compra

ACTIONS:
Ver Ayuda → ayuda (navigate)
---
```

#### 4. Handoff SIN Video

```
"¿Cómo vendo entradas?"
"¿Paso a paso para vender?"
```

**Esperado**:

```
ARCHETYPE: handoff

MESSAGE:
Para vender entradas en RedTickets, sigue estos pasos...

ACTIONS:
Ver Guía → ayuda?tab=vender (navigate)
Contactar → contacto (navigate)
---
```

#### 5. Eventos específicos

```
"Quiero ver a Shakira"
"¿Cuándo viene Taylor Swift?"
```

**Esperado**:

```
ARCHETYPE: inform

MESSAGE:
Los eventos se publican en RedTickets.uy. Puedes ver eventos actuales en la sección de comunidad.

ACTIONS:
Ver Eventos → comunidad (navigate)
Contactar → contacto (navigate)
---
```

#### 6. Redirect

```
"¿Cuál es el clima?"
"Quiero viajar"
```

**Esperado**:

```
ARCHETYPE: redirect

MESSAGE:
No ofrecemos ese servicio. Nos especializamos en ticketing para eventos.

ACTIONS:
Ver Servicios → servicios (navigate)
Contactar → contacto (navigate)
---
```

### Testing Manual

```bash
# 1. Iniciar backend
cd backend
npm run dev

# 2. Iniciar frontend
cd frontend
npm run dev

# 3. Probar con cURL
curl -X POST http://localhost:3000/api/chat-structured \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Qué servicios ofrecen?"}]}'

# 4. Probar en navegador
# Abrir http://localhost:5173
# Click en botón de chat flotante
```

### Testing de UI

- ✅ Botón de limpiar chat funciona
- ✅ Botón de maximizar/minimizar funciona
- ✅ Botón de cerrar funciona
- ✅ Auto-scroll a nuevo mensaje
- ✅ Cards son clickeables y navegan correctamente
- ✅ Video se reproduce
- ✅ Botones ACTIONS funcionan y navegan
- ✅ Responsive en móvil

---

## 🚀 Deployment

### Preparación

1. **Build backend**:

```bash
cd backend
npm run build
```

2. **Build frontend**:

```bash
cd frontend
npm run build
```

### Render.com (Recomendado)

Ya configurado en `render.yaml`:

**Backend** (Web Service):

- Build: `npm install && npm run build`
- Start: `npm run start`
- Env vars: `DATABASE_URI`, `GROQ_API_KEY`, `PAYLOAD_SECRET`

**Frontend** (Static Site):

- Build: `npm install && npm run build`
- Publish: `dist/`

### Variables de Entorno en Producción

**Backend** (Render.com):

```
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=<nuevo secreto generado>
GROQ_API_KEY=gsk_...
NODE_ENV=production
```

**Frontend** (Render.com):

```
VITE_API_URL=https://tu-backend.onrender.com
VITE_CHAT_API_URL=https://tu-backend.onrender.com/api/chat-structured
VITE_ENABLE_AI_CHAT=true
```

### Post-Deployment

1. Verificar que `/api/chat-structured` responde
2. Probar chat en frontend desplegado
3. Verificar logs en Render dashboard
4. Monitorear errores primeras 24h

---

## 📊 Métricas de Performance

- **Tiempo de respuesta**: ~2-3 segundos (llama-3.1-8b-instant)
- **Inicio de streaming**: ~500ms
- **Cache de contenido**: 5 minutos
- **Timeout**: 30 segundos
- **Tamaño del bundle**: +15KB (componentes visuales)

---

## 🐛 Troubleshooting

### Backend no responde

```bash
# Verificar API key
cat backend/.env | grep GROQ_API_KEY

# Verificar logs
cd backend && npm run dev
# Buscar errores en terminal
```

### Frontend no parsea respuesta

**Síntoma**: Mensaje del usuario aparece pero respuesta del bot no

**Causa común**: Formato de respuesta incorrecto o incompleto

**Solución**: Verificar que SYSTEM_PROMPT enfatiza formato estructurado:

```
"Respondes con TEXTO ESTRUCTURADO usando formato ARCHETYPE/MESSAGE/VISUAL/ACTIONS"
"NUNCA respondas en blanco - siempre incluye MESSAGE con texto"
```

**Debug**:

```bash
# Probar endpoint directamente
curl -s -X POST http://localhost:3000/api/chat-structured \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hola"}]}'

# Debería retornar formato:
# ARCHETYPE: inform
# MESSAGE:
# [texto]
# ---
```

### Visual blocks no renderizan

**Debug en browser**:

```javascript
// Console
console.log(message.layers.visual);
// Verificar estructura del JSON
```

**Causas comunes**:

- Falta campo requerido (title, src, etc.)
- Tipo incorrecto (typo en "card-list")
- Datos vacíos o undefined

### Navegación no funciona

**Verificar**:

- React Router configurado en `App.jsx`
- Rutas existen: `/seccion/servicios`, etc.
- `useNavigate()` hook importado correctamente

---

## 📚 Referencias

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Documentación oficial
- [Groq API](https://console.groq.com/docs) - Modelos y límites
- [Payload CMS](https://payloadcms.com/docs) - Collections y API
- [React Router](https://reactrouter.com) - Navegación

---

## 🎉 Resumen Ejecutivo

El chatbot de RedTickets usa formato de **texto estructurado** optimizado para Groq:

1. ✅ La IA retorna **texto estructurado** (ARCHETYPE/MESSAGE/VISUAL/ACTIONS), no JSON puro
2. ✅ El frontend **parsea y renderiza componentes** basados en ese texto
3. ✅ Formato **tolerante** compatible con Groq free tier (más confiable que JSON estricto)
4. ✅ Cada mensaje tiene un **arquetipo** que clasifica la intención
5. ✅ Conectado a **Payload CMS** para contenido real, no hardcodeado
6. ✅ **Streaming** para respuestas progresivas con parsing incremental
7. ✅ **Componentes visuales** (CARDS, VIDEO) cuando agregan valor
8. ✅ **Tabs específicas en Ayuda** (ayuda?tab=vender, etc.) para navegación precisa
9. ✅ **Reglas estrictas** para evitar inventar datos o comportamiento errático

**Estado actual**: ✅ Funcional en desarrollo, listo para producción

**Próximos pasos sugeridos**:

- Agregar más videos tutoriales (vender, configurar, etc.)
- Implementar memoria de conversación (RAG)
- Analytics de preguntas más comunes
- A/B testing de prompts
