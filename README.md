<div align="center">

# Blog RedTickets 

### Sistema de Gestión de Contenidos con IA Conversacional

Plataforma headless CMS con chatbot inteligente, búsqueda semántica y Generative UI. Construida con tecnologías modernas para escalabilidad y rendimiento. Proyecto Final para la licenciatura en Diseño Multimedia de la Universidad ORT Uruguay.

[![Node.js](https://img.shields.io/badge/Node.js-20.19.5-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.59-000000?style=flat&logo=payload&logoColor=white)](https://payloadcms.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-Audited-success?style=flat&logo=shield&logoColor=white)](./SECURITY.md)

[Instalación](#-inicio-rápido) · [Documentación](./DEPLOY-GUIDE.md) · [Chatbot](./DOCUMENTACION-CHATBOT.md) · [Seguridad](./SECURITY.md)

</div>

---

> **🔒 Proyecto Open Source Seguro**: Este repositorio ha sido auditado y está listo para fork/clone. Lee [SECURITY.md](./SECURITY.md) para configurar tus credenciales de forma segura. **Nunca uses valores de ejemplo en producción**.

---

## 🚀 Descripción General

**RedTickets Blog** es una plataforma de gestión de contenidos empresarial que combina la potencia de Payload CMS con capacidades avanzadas de IA conversacional. Diseñada para ofrecer experiencias de usuario excepcionales con respuestas inteligentes en tiempo real.

### Características Principales

🧠 **IA Conversacional Avanzada**  
Chatbot powered by Groq (Llama 3.1-8b-instant) con streaming de respuestas y Generative UI contextual

🎨 **Interfaz Dinámica Generativa**  
Sistema de componentes visuales que se adaptan al contexto de la conversación en tiempo real

📊 **Arquitectura Headless**  
Separación completa frontend/backend con API REST/GraphQL auto-generadas por Payload CMS

🔍 **Búsqueda Semántica**  
Embeddings con OpenAI para búsqueda inteligente de contenido relevante

💬 **Sistema de Comentarios**  
Moderación automática con análisis de sentimiento y detección de toxicidad

📱 **100% Responsive**  
Diseño mobile-first con experiencia optimizada para todos los dispositivos

⚡ **Rendimiento Optimizado**  
Vite + React 19 para tiempos de carga ultrarrápidos y hot reload instantáneo

🛡️ **Seguridad Enterprise**  
Autenticación JWT, CORS configurado, protección CSRF y análisis de contenido

---

## � Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Chatbot con IA](#-chatbot-con-ia)
- [API y Endpoints](#-api-y-endpoints)
- [Despliegue](#-despliegue)
- [Documentación](#-documentación)

---

## 🛠️ Stack Tecnológico

### Backend

- **Framework**: Next.js 15.4.8 (App Router)
- **CMS**: Payload CMS 3.59.1
- **Base de Datos**: MongoDB Atlas (Mongoose adapter)
- **IA**: Groq AI (Llama 3.1-8b-instant)
- **SDK**: Vercel AI SDK v5
- **Embeddings**: OpenAI API
- **Runtime**: Node.js 20.19.5

### Frontend

- **Framework**: React 19.1.2
- **Build Tool**: Vite 5
- **Router**: React Router 6
- **Estilos**: CSS Modules + Animaciones CSS
- **HTTP Client**: Fetch API con streaming

### DevOps

- **Tests**: Vitest + Playwright
- **Deploy**: Render.com (Blueprint automation)
- **CI/CD**: GitHub Actions ready
- **Container**: Docker support incluido

---

## ⚡ Inicio Rápido

### Prerequisitos

| Herramienta   | Versión   | Enlace                                                      |
| ------------- | --------- | ----------------------------------------------------------- |
| Node.js       | 20.19.5+  | [Descargar](https://nodejs.org/)                            |
| MongoDB Atlas | Free Tier | [Registrarse](https://www.mongodb.com/cloud/atlas/register) |
| Groq API Key  | Gratuita  | [Obtener Key](https://console.groq.com/)                    |

> **📚 Guía de Seguridad**: Ver [SECURITY.md](./SECURITY.md) para obtener tus credenciales de forma segura.

### Instalación en 3 Pasos

#### 1️⃣ Configurar Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# ⚠️ IMPORTANTE: Editar .env con TUS credenciales reales
# Ver SECURITY.md para obtenerlas

# Cargar contenido inicial
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

✅ **Admin Panel**: http://localhost:3000/admin  
✅ **API Docs**: http://localhost:3000/api

#### 2️⃣ Configurar Frontend

```bash
cd frontend
npm install

# Configurar API endpoints
cp .env.example .env
# Verificar VITE_API_URL apunta al backend

# Iniciar aplicación
npm run dev
```

✅ **Blog**: http://localhost:5173  
✅ **Chatbot**: Disponible en todas las páginas

#### 3️⃣ Configuración Inicial

1. Accede al Admin Panel: http://localhost:3000/admin
2. Crea tu usuario administrador
3. Verifica el contenido en **Collections > ContenidoBlog**
4. Abre el blog y prueba el chatbot 💬

### Verificación de Instalación

```bash
# Backend health check
curl http://localhost:3000/api/chat/health

# Verificar contenido
curl http://localhost:3000/api/contenido-blog

# Frontend build
cd frontend && npm run build
```

---

## 🏗️ Arquitectura

### Flujo de Datos

```mermaid
graph LR
    A[Usuario] -->|HTTP| B[Frontend React]
    B -->|REST API| C[Backend Next.js]
    C -->|Mongoose| D[MongoDB Atlas]
    C -->|AI Requests| E[Groq API]
    B -->|Streaming| F[Chatbot UI]
    C -->|Embeddings| G[OpenAI API]
```

### Estructura del Proyecto

```
redtickets/
├── backend/                    # Payload CMS + Next.js API
│   ├── src/
│   │   ├── collections/        # Modelos de datos (Collections)
│   │   │   ├── ContenidoBlog.ts    # Contenido estructurado por secciones
│   │   │   ├── Comments.ts         # Sistema de comentarios + análisis
│   │   │   ├── Users.ts            # Autenticación y usuarios
│   │   │   └── Media.ts            # Gestión de archivos
│   │   ├── app/api/
│   │   │   ├── chat/              # Chatbot legacy (text commands)
│   │   │   ├── chat-structured/   # Chatbot con Generative UI
│   │   │   └── [...slug]/         # Auto-generated Payload API
│   │   ├── utils/
│   │   │   └── analizarTexto.ts   # Análisis de sentimiento
│   │   └── payload.config.ts      # Configuración CMS
│   ├── tests/                  # Tests de integración y E2E
│   └── seed-contenido.js       # Script de carga inicial
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatUI.jsx         # Interfaz del chatbot
│   │   │   ├── chatbot/           # Componentes de Generative UI
│   │   │   │   ├── CardList.jsx
│   │   │   │   ├── ImageGallery.jsx
│   │   │   │   └── VideoBlock.jsx
│   │   │   └── SectionContent.jsx  # Renderizador de secciones
│   │   ├── hooks/
│   │   │   ├── useSimpleChat.js   # Chat con text commands
│   │   │   └── useStructuredChat.js # Chat con JSON streaming
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Página principal
│   │   │   └── SectionPage.jsx    # Template de secciones
│   │   └── services/
│   │       └── api.js             # Cliente HTTP
│   └── vite.config.js
│
└── render.yaml                 # Blueprint de despliegue automático
```

### Collections (Modelos de Datos)

#### ContenidoBlog

Sistema único de sección única (1 documento = 1 sección del sitio)

```typescript
{
  seccion: 'inicio' | 'sobre_nosotros' | 'servicios' | 'comunidad' | 'ayuda' | 'contacto',
  titulo: string,
  descripcion: string,
  // Campos condicionales según sección
  estadisticas?: { transacciones, eventos_realizados, productores },
  fundadores?: [{ nombre, cargo, imagen }],
  equipo?: [{ nombre, area, imagen }],
  eventos?: [{ titulo, fecha, descripcion, imagen }],
  faqs?: [{ pregunta, respuesta }]
}
```

#### Comments

Sistema de comentarios con moderación automática

```typescript
{
  author: string,
  comment: string,
  eventRef?: string,
  sentimentScore: number,      // -1 a 1 (calculado automáticamente)
  toxicityScore: number,       // 0 a 1 (calculado automáticamente)
  status: 'pendiente' | 'publicado' | 'rechazado'
}
```

---

## 🤖 Chatbot con IA

### Características del Chatbot

| Característica    | Descripción                                |
| ----------------- | ------------------------------------------ |
| **Motor de IA**   | Groq Cloud (Llama 3.1-8b-instant)          |
| **Arquitectura**  | 5 Archetypes + 5 Layers de respuesta       |
| **Streaming**     | Respuestas incrementales con Vercel AI SDK |
| **Generative UI** | Componentes React generados dinámicamente  |
| **Fallback**      | Respuestas offline si falla la API         |
| **Contexto**      | Conocimiento completo del sitio            |

### Arquitectura del Chatbot

```typescript
// Flujo de conversación
Usuario → ChatUI.jsx
       → useStructuredChat hook
       → POST /api/chat-structured
       → Groq streamText() con JSON schema
       → Respuesta estructurada con layers
       → Parser JSON en frontend
       → Renderizado de componentes visuales
```

### Respuestas Estructuradas (Generative UI)

El chatbot genera respuestas siguiendo una arquitectura de layers:

```json
{
  "archetype": "discover",  // discover | compare | inform | handoff | redirect
  "layers": {
    "visual": [              // Componentes UI
      {
        "type": "card-list",
        "cards": [
          { "title": "Servicio 1", "description": "...", "action": {...} }
        ]
      }
    ],
    "acknowledge": {
      "text": "Entiendo que buscas información sobre..."
    },
    "context": {
      "text": "Nuestros servicios incluyen..."
    },
    "insight": {
      "text": "Te recomiendo comenzar por..."
    },
    "nextSteps": [           // Máximo 3 acciones
      { "type": "navigate", "label": "Ver Servicios", "target": "/seccion/servicios" }
    ]
  }
}
```

### Componentes Visuales Disponibles

- **CardList**: Lista de opciones con acciones (servicios, productos)
- **ImageGallery**: Grid de imágenes (equipo, galería)
- **ImageBlock**: Imagen única con caption
- **VideoBlock**: Video embebido (tutorial de compra)

### Endpoints del Chatbot

| Endpoint               | Método | Descripción                                       |
| ---------------------- | ------ | ------------------------------------------------- |
| `/api/chat-structured` | POST   | Chat principal con Generative UI (JSON streaming) |
| `/api/chat`            | POST   | Chat legacy con comandos de texto embebidos       |
| `/api/chat/health`     | GET    | Health check del servicio                         |

**Documentación completa**: [DOCUMENTACION-CHATBOT.md](./DOCUMENTACION-CHATBOT.md)

---

## 🌐 API y Endpoints

### Payload CMS API (Auto-generada)

Todos los endpoints REST y GraphQL se generan automáticamente:

```bash
# Collections
GET    /api/contenido-blog          # Listar contenido
GET    /api/contenido-blog/:id      # Obtener por ID
POST   /api/contenido-blog          # Crear (requiere auth)
PATCH  /api/contenido-blog/:id      # Actualizar (requiere auth)
DELETE /api/contenido-blog/:id      # Eliminar (requiere auth)

GET    /api/comments                # Listar comentarios
POST   /api/comments                # Crear comentario (público)

GET    /api/media                   # Listar archivos
POST   /api/media                   # Subir archivo (requiere auth)

# GraphQL
POST   /api/graphql                 # Endpoint GraphQL
GET    /api/graphql-playground      # Playground interactivo
```

### Query Parameters

```bash
# Filtros
GET /api/contenido-blog?where={"seccion":{"equals":"inicio"}}

# Paginación
GET /api/contenido-blog?page=1&limit=10

# Ordenamiento
GET /api/contenido-blog?sort=-createdAt

# Profundidad (populate relations)
GET /api/contenido-blog?depth=2

# Selección de campos
GET /api/contenido-blog?select=titulo,descripcion
```

### Custom Endpoints

```bash
# Chatbot
POST   /api/chat-structured         # Chat con Generative UI (principal)
POST   /api/chat                    # Chat legacy con text commands
GET    /api/chat/health             # Health check

# Utilidades
POST   /api/seed-contenido          # Cargar contenido inicial (dev)
POST   /api/reset-contenido         # Resetear base de datos (dev)
GET    /api/check-users             # Verificar usuarios existentes
```

### Ejemplo de Uso (JavaScript)

```javascript
// Obtener contenido de una sección
const response = await fetch(
  "http://localhost:3000/api/contenido-blog?where[seccion][equals]=inicio",
);
const data = await response.json();
console.log(data.docs[0]);

// Crear comentario
const comment = await fetch("http://localhost:3000/api/comments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    author: "Juan Pérez",
    comment: "Excelente evento!",
    eventRef: "evento-id-123",
  }),
});

// Chat con streaming
const response = await fetch("http://localhost:3000/api/chat-structured", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "¿Qué servicios ofrecen?" }],
  }),
});
const reader = response.body.getReader();
// ... procesar stream
```

---

## 🚀 Despliegue

### Opción 1: Despliegue Automático con Render (Recomendado)

El proyecto incluye `render.yaml` para despliegue automático:

1. **Fork o Push a GitHub**

   ```bash
   git remote add origin https://github.com/tu-usuario/redtickets.git
   git push -u origin main
   ```

2. **Conectar con Render**
   - Ve a [Render Dashboard](https://dashboard.render.com/)
   - New → Blueprint
   - Conecta tu repositorio de GitHub
   - Render detecta `render.yaml` automáticamente

3. **Configurar Variables de Entorno**

   **Backend Service:**

   ```env
   DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/redtickets
   PAYLOAD_SECRET=tu-secret-generado-con-openssl
   GROQ_API_KEY=gsk_tu_key_aqui
   NODE_ENV=production
   ```

   **Frontend Static Site:**

   ```env
   VITE_API_URL=https://tu-backend.onrender.com
   VITE_CHAT_API_URL=https://tu-backend.onrender.com/api/chat-structured
   VITE_ENABLE_AI_CHAT=true
   ```

4. **Deploy** - Render construye y despliega automáticamente

### Opción 2: Docker

```bash
# Backend
cd backend
docker build -t redtickets-backend .
docker run -p 3000:3000 --env-file .env redtickets-backend

# Frontend (construir localmente)
cd frontend
npm run build
# Servir con nginx, apache o CDN
```

### Variables de Entorno Requeridas

#### Backend (.env)

```env
# Base de datos
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Payload CMS
PAYLOAD_SECRET=tu-secret-de-al-menos-32-caracteres
NEXT_PUBLIC_SERVER_URL=https://tu-dominio.com

# IA
GROQ_API_KEY=gsk_tu_key_de_groq
OPENAI_API_KEY=sk-tu_key_de_openai  # Opcional (para embeddings)

# Entorno
NODE_ENV=production
PORT=3000
```

#### Frontend (.env)

```env
VITE_API_URL=https://tu-backend.onrender.com
VITE_CHAT_API_URL=https://tu-backend.onrender.com/api/chat-structured
VITE_ENABLE_AI_CHAT=true
```

### Generar Secrets

```bash
# PAYLOAD_SECRET (mínimo 32 caracteres)
openssl rand -base64 32

# O con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Documentación completa de despliegue**: [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

---

## 🧪 Testing

### Tests de Integración (Vitest)

```bash
cd backend
npm run test:int              # Tests de API y Collections
npm run test:int:watch        # Modo watch
```

### Tests E2E (Playwright)

```bash
cd backend
npm run test:e2e              # Tests en navegador
npm run test:e2e:headed       # Con UI visible
npm run test:e2e:debug        # Con debugger
```

### Ejecutar Todos los Tests

```bash
cd backend
npm run test                  # Int + E2E
```

---

## 📝 Scripts Útiles

### Backend

| Comando                  | Descripción                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Servidor de desarrollo (hot reload)        |
| `npm run build`          | Compilar para producción                   |
| `npm run start`          | Iniciar servidor de producción             |
| `npm run devsafe`        | Limpiar cache y reiniciar dev              |
| `npm run seed`           | Cargar contenido inicial                   |
| `npm run generate:types` | Generar tipos TypeScript desde collections |
| `npm run test`           | Ejecutar todos los tests                   |
| `npm run test:int`       | Tests de integración                       |
| `npm run test:e2e`       | Tests end-to-end                           |

### Frontend

| Comando           | Descripción                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desarrollo Vite      |
| `npm run build`   | Build optimizado para producción |
| `npm run preview` | Preview del build de producción  |
| `npm run lint`    | Ejecutar ESLint                  |

---

## 🐛 Troubleshooting

### Backend no inicia

**Error**: `Cannot connect to MongoDB`  
**Solución**: Verifica que `DATABASE_URI` en `.env` sea correcta y que tu IP esté whitelisted en MongoDB Atlas

**Error**: `PAYLOAD_SECRET is required`  
**Solución**: Genera un secret con `openssl rand -base64 32` y agrégalo al `.env`

**Error**: `Port 3000 already in use`  
**Solución**:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# O cambia el puerto en .env
PORT=3001
```

### Chatbot no responde

**Error**: `Groq API error: Unauthorized`  
**Solución**: Verifica que `GROQ_API_KEY` esté configurada correctamente en `backend/.env`

**Error**: Respuestas muy lentas  
**Solución**: Verifica tu plan de Groq. El tier gratuito tiene rate limits (30 req/min)

### Frontend no conecta con API

**Error**: `Network Error` en consola  
**Solución**: Verifica que `VITE_API_URL` en `frontend/.env` apunte al backend correcto

**Error**: CORS issues  
**Solución**: El backend ya tiene CORS configurado para localhost:5173. Si usas otro puerto, agrégalo en `backend/src/payload.config.ts`

### Contenido no aparece

**Error**: Collections vacías  
**Solución**:

```bash
cd backend
npm run seed  # Carga contenido de ejemplo
```

**Error**: "Cannot find section"  
**Solución**: Verifica que el valor de `seccion` en el admin panel sea exactamente: `inicio`, `sobre_nosotros`, `servicios`, `comunidad`, `ayuda` o `contacto` (con guiones bajos, no espacios)

### Node.js version warning

**Error**: `You are using Node.js 18.x`  
**Solución**:

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Usar versión correcta
nvm install 20.19.5
nvm use 20.19.5
nvm alias default 20.19.5
```

---

## 📚 Documentación

### Guías Completas

| Documento                                                            | Descripción                                              |
| -------------------------------------------------------------------- | -------------------------------------------------------- |
| [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)                                 | Guía completa de despliegue en Render con GitHub Actions |
| [DOCUMENTACION-CHATBOT.md](./DOCUMENTACION-CHATBOT.md)               | Arquitectura detallada del chatbot y Generative UI       |
| [STRUCTURED-CHAT-GUIDE.md](./STRUCTURED-CHAT-GUIDE.md)               | Especificaciones del sistema de chat estructurado        |
| [SECURITY.md](./SECURITY.md)                                         | 🔒 Guía de seguridad para contribuidores                 |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | Instrucciones para desarrollo con GitHub Copilot         |

### Referencias Externas

- [Payload CMS Documentation](https://payloadcms.com/docs) - Collections, Hooks, Authentication
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - streamText, useChat patterns
- [Groq Cloud Documentation](https://console.groq.com/docs) - Modelos, Rate limits, Best practices
- [Next.js 15 Docs](https://nextjs.org/docs) - App Router, API Routes, Deployment
- [React 19 Docs](https://react.dev) - Hooks, Components, Performance
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/) - Cloud database, Security
- [Vite Documentation](https://vitejs.dev/) - Build optimization, Plugins

### API Reference

- **Payload REST API**: `http://localhost:3000/api/<collection-name>`
- **GraphQL Playground**: `http://localhost:3000/api/graphql-playground`
- **Admin Panel**: `http://localhost:3000/admin`

### Ejemplos de Código

Ver carpeta `backend/tests/` para ejemplos de uso de la API y tests de integración.

---

## 🔒 Seguridad

### Antes de Hacer Fork o Clonar

⚠️ **IMPORTANTE**: Este es un proyecto open source. Antes de usarlo:

1. **Lee [SECURITY.md](./SECURITY.md)** - Guía completa de seguridad
2. **Ejecuta el audit**: `./security-check.sh` antes de hacer push
3. **NUNCA uses credenciales de ejemplo** en producción
4. **Rota todas las credenciales** si vas a hacer el repo público

### Herramienta de Auditoría

```bash
# Ejecutar antes de cada push a GitHub
./security-check.sh
```

Este script verifica:

- ✅ Archivos `.env` no están en staging
- ✅ Sin secrets en historial de Git
- ✅ Sin credenciales hardcodeadas
- ✅ `.gitignore` configurado correctamente
- ✅ Dependencias sin vulnerabilidades

### Vulnerabilidades Conocidas - Ninguna

✅ **Última auditoría**: Enero 24, 2026  
✅ **Dependencias actualizadas**: Todas las dependencias críticas están en sus últimas versiones

### Parches de Seguridad Aplicados

| CVE            | Paquete | Versión Vulnerable | Versión Parcheada | Fecha    |
| -------------- | ------- | ------------------ | ----------------- | -------- |
| CVE-2025-66478 | Next.js | < 15.4.8           | 15.4.8            | Dic 2025 |
| CVE-2025-55182 | React   | < 19.1.2           | 19.1.2            | Dic 2025 |

### Características de Seguridad

- ✅ **Autenticación JWT** con Payload CMS
- ✅ **CORS** configurado para dominios específicos
- ✅ **Protección CSRF** con tokens
- ✅ **Análisis de toxicidad** automático en comentarios
- ✅ **Rate limiting** en endpoints de chat (Groq)
- ✅ **Sanitización de inputs** con Payload validators
- ✅ **HTTPS only** en producción (Render)
- ✅ **Environment variables** nunca expuestas en frontend

## 📞 Soporte y Contacto

- **Documentación**: Ver carpeta `/docs` o archivos `.md` en la raíz
- **Issues técnicos**: Revisar sección [Troubleshooting](#-troubleshooting)
- **Preguntas sobre IA**: Ver [DOCUMENTACION-CHATBOT.md](./DOCUMENTACION-CHATBOT.md)

---

<div align="center">

**Construido con ❤️ por Iara Suster**

[⬆ Volver arriba](#-redtickets-blog-platform)

</div>
