# Instrucciones del Proyecto - Blog RedTickets con IA

## Descripción

Blog corporativo headless con CMS, chatbot inteligente y Generative UI para RedTickets.

## Arquitectura

- **Backend**: Payload CMS con Next.js 15 y MongoDB Atlas
- **Frontend**: React con Vite y React Router
- **Base de datos**: MongoDB Atlas (Cloud)
- **APIs**: REST automática generada por Payload
- **IA**: Groq (Llama 3.1) + Vercel AI SDK + Generative UI
- **Runtime**: Node.js 20.19.5 (gestionado con nvm)

## Estructura de Datos

### Colección Posts

```typescript
{
  titulo: string (requerido)
  autor: string (requerido)
  fecha: date (requerido)
  imagenDestacada: upload (opcional)
  contenido: richText (requerido)
  slug: string (único, auto-generado)
  publicado: boolean (default: false)
  extracto: textarea (opcional)
}
```

## Componentes Frontend

### BlogList.jsx

- Muestra posts en formato tarjetas
- Paginación y filtros
- Manejo de estados de carga
- Responsive design

### BlogPost.jsx

- Vista detalle de post individual
- Renderizado de contenido rico
- Navegación entre posts
- Breadcrumbs

### Chatbot.jsx

- Chat flotante interactivo
- Respuestas predefinidas por categorías
- Animaciones y transiciones
- Responsive mobile-first

## APIs Disponibles

### Endpoints Principales

- `GET /api/posts` - Lista de posts
- `GET /api/posts/:id` - Post por ID
- `GET /api/posts?where={"slug":{"equals":"post-slug"}}` - Post por slug
- `GET /api/media` - Archivos multimedia

### Filtros y Consultas

```javascript
// Solo posts publicados
where: {
  publicado: {
    equals: true;
  }
}

// Búsqueda por texto
where: {
  titulo: {
    contains: "término";
  }
}

// Ordenamiento
sort: "-fecha";
```

## Configuración de Desarrollo

### Puertos

- Backend: http://localhost:3001
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:3001/admin

### Variables de Entorno

```
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
PAYLOAD_SECRET=tu-secret-key
```

## Comandos Útiles

### Backend

```bash
cd backend
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
```

### Frontend

```bash
cd frontend
npm run dev          # Desarrollo
npm run build        # Construcción
npm run preview      # Preview de build
```

## Chatbot con IA y Generative UI

### Estructura del Chatbot

```
ai-assistant/
├── useChatbot.js           # Hook React para gestión de chat (LEGACY - no usar)
├── generativeActions.jsx   # Acciones dinámicas UI (LEGACY - no usar)
└── chatbot.js              # LEGACY - usar backend API en su lugar

hooks/
└── useSimpleChat.js        # Hook React con streaming y parsing de acciones

components/
├── ChatUI.jsx              # Interfaz de chat con streaming
└── GenerativeRenderer.jsx  # Renderizador de UI dinámica (LEGACY)
```

### Flujo del Chatbot

1. Usuario escribe pregunta en ChatUI.jsx
2. useSimpleChat.js envía request a backend /api/chat
3. Backend usa Vercel AI SDK + Groq (Llama 3.1-8b-instant)
4. Respuesta streaming con comandos [ACTION:navigate:seccion|label]
5. useSimpleChat parsea acciones y genera botones dinámicos
6. Botones navegan a secciones del sitio

### Modelos de IA

- **Producción**: Groq `llama-3.1-8b-instant` (gratis, ultra-rápido)
- **Alternativas**: `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`
- **API**: Groq Cloud (gratuita con rate limits generosos)
- **SDK**: Vercel AI SDK v5 con `streamText()` y tools

### Generative UI

- Basado en comandos inyectados en el texto: `[ACTION:navigate:seccion|label]`
- Parser en useSimpleChat.js extrae comandos y genera botones
- Botones de navegación renderizados dinámicamente en ChatUI
- Navega a: inicio, sobre-nosotros, servicios, comunidad, ayuda, contacto

## Próximas Mejoras

- [x] Chatbot con Groq + Vercel AI SDK ✅
- [x] Generative UI con comandos de navegación ✅
- [x] Streaming de respuestas en tiempo real ✅
- [ ] Más tipos de acciones (cards, FAQs, formularios)
- [ ] Sistema de comentarios
- [ ] SEO dinámico
- [ ] PWA capabilities
- [ ] Optimización de imágenes
- [ ] Analytics de conversaciones del bot
