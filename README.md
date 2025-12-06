# 🎯 Blog RedTickets - Sistema Completo con IA

Blog corporativo headless con **Payload CMS**, **React**, **MongoDB Atlas** y **Chatbot con IA Generativa**.

---

## ✨ Características

- ✅ **Payload CMS** - Gestión de contenido headless
- ✅ **React + Vite** - Frontend moderno y rápido
- ✅ **MongoDB Atlas** - Base de datos en la nube
- ✅ **Chatbot con IA** - Integración con Groq (Llama 3.1-8b-instant)
- ✅ **Búsqueda Semántica** - Embeddings con OpenAI
- ✅ **Generative UI** - Interfaz dinámica según contexto
- ✅ **6 Secciones** - Inicio, Sobre Nosotros, Servicios, Comunidad, Ayuda, Contacto
- ✅ **Responsive** - Mobile-first design
- ✅ **SEO Ready** - Optimizado para buscadores

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js 20.19.5** (usar nvm)
- **MongoDB Atlas** account (gratuito)
- **Groq API Key** (gratuito - https://console.groq.com)

### 1. Configurar Node.js

```bash
# Verificar versión
node --version

# Si es menor a 20.19, actualizar con nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20.19.5
nvm use 20.19.5
```

### 2. Backend - Payload CMS

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URI, PAYLOAD_SECRET y GROQ_API_KEY
npm run dev
```

**URL Admin**: http://localhost:3000/admin (crear usuario la primera vez)

### 3. Frontend - React

```bash
cd ../frontend
npm install
npm run dev
```

**URL Blog**: http://localhost:5173

### 🎯 Primera Prueba

1. Ve al admin: http://localhost:3000/admin
2. Crea tu usuario administrador
3. Ve a "ContenidoBlog" para ver el contenido cargado
4. Abre el blog: http://localhost:5173
5. Prueba el chatbot 💬 - pregunta sobre servicios o eventos

---

## 🤖 Chatbot con IA

El proyecto incluye un chatbot inteligente con:

- 🧠 **IA Conversacional** - Powered by Groq (Llama 3.1-8b-instant)
- 🎨 **Generative UI** - Botones de navegación dinámicos
- 📊 **Streaming** - Respuestas en tiempo real
- 💬 **Contexto del Sitio** - Conoce todas las secciones
- 🔄 **Fallback Inteligente** - Respuestas offline si falla API

### Endpoints del Chatbot

- `POST /api/chat` - Chat con streaming (Vercel AI SDK)
- `GET /api/chat/health` - Health check

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── collections/          # Modelos de datos
│   │   ├── ContenidoBlog.ts  # Contenido estructurado
│   │   ├── Comments.ts       # Sistema de comentarios
│   │   ├── Users.ts          # Usuarios admin
│   │   └── Media.ts          # Gestión de archivos
│   ├── app/api/
│   │   ├── chat/            # Chatbot con Groq + Vercel AI SDK
│   │   └── ...              # Otros endpoints
│   └── payload.config.ts    # Configuración Payload
├── seed-contenido.js        # Script para cargar contenido inicial
└── .env                     # Variables de entorno

frontend/
├── src/
│   ├── components/
│   │   ├── ChatUI.jsx       # Interfaz del chatbot
│   │   ├── SectionContent.jsx  # Renderizador de secciones
│   │   └── ...
│   ├── hooks/
│   │   └── useSimpleChat.js # Hook de chat con streaming
│   ├── pages/
│   │   ├── Home.jsx         # Página principal
│   │   └── SectionPage.jsx  # Páginas de secciones
│   └── services/
│       └── api.js           # Cliente API
```

---

## 🚀 Despliegue en Render

Ver guía completa: [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

### Resumen rápido:

1. **MongoDB Atlas**: Crear cluster gratuito y obtener connection string
2. **Groq API**: Registrarse en https://console.groq.com y obtener API key
3. **GitHub**: Subir proyecto a un repositorio
4. **Render**: 
   - Backend (Web Service) con variables: `DATABASE_URI`, `PAYLOAD_SECRET`, `GROQ_API_KEY`
   - Frontend (Static Site) con variables: `VITE_API_URL`, `VITE_CHAT_API_URL`

---

## 🔧 Variables de Entorno

### Backend (.env)

```env
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
PAYLOAD_SECRET=$(openssl rand -base64 32)
GROQ_API_KEY=gsk_tu_key_aqui
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_API_URL=http://localhost:3000/api/chat
```

---

## 🛠️ Scripts Útiles

### Backend

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Ejecutar producción
npm run seed         # Cargar contenido inicial
npm run test         # Ejecutar tests
```

### Frontend

```bash
npm run dev          # Desarrollo
npm run build        # Build
npm run preview      # Preview del build
```

---

## 🐛 Troubleshooting

### Error "Cannot connect to API"
→ Verificar que backend esté corriendo en puerto 3000

### Error de Node.js "You are using Node.js 18..."
→ Actualizar a Node.js 20.19.5+ con nvm

### Chatbot no responde
→ Verificar que `GROQ_API_KEY` esté configurada en backend/.env

### Posts no aparecen
→ Ejecutar `npm run seed` en backend para cargar contenido inicial

---

## 📚 Documentación

- [Guía de Despliegue](./DEPLOY-GUIDE.md) - Deploy en Render con GitHub
- [Payload CMS Docs](https://payloadcms.com/docs)
- [Copilot Instructions](./.github/copilot-instructions.md)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Groq Cloud](https://console.groq.com/docs)

---

## 🔒 Seguridad

- ✅ Next.js 15.4.8 (Patch CVE-2025-66478)
- ✅ React 19.1.2 (Patch CVE-2025-55182)
- Actualizado: Diciembre 6, 2025

---

¡Disfruta construyendo con RedTickets! 🎉
