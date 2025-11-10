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

- Node.js 20.19.5 (usar nvm)
- MongoDB Atlas account (gratuito)
- Groq API Key (gratuito - https://console.groq.com)

### Instalación

```bash
# 1. Configurar Node.js
nvm use 20.19.5

# 2. Backend - Payload CMS
cd backend
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URI, PAYLOAD_SECRET y GROQ_API_KEY
npm run dev

# 3. Frontend - React
cd ../frontend
npm install
npm run dev
```

### Acceso

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:3000/admin
- **API REST**: http://localhost:3000/api/

---

## 🤖 Chatbot con IA

El proyecto incluye un chatbot inteligente con:

- 🧠 **IA Conversacional** - Powered by Mistral-7B-Instruct
- 🎨 **Generative UI** - Botones y cards dinámicos según contexto
- 📊 **Detección de Intenciones** - Servicios, contacto, eventos, ayuda
- 💬 **Contexto de Conversación** - Recuerda últimos 3 mensajes
- 🔄 **Fallback Inteligente** - Respuestas offline si falla API

Ver documentación completa en [AI-CHATBOT-README.md](./AI-CHATBOT-README.md)

---

## 📚 Documentación

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Chatbot IA Guide](./AI-CHATBOT-README.md)
- [Copilot Instructions](./.github/copilot-instructions.md)

---

¡Disfruta construyendo con RedTickets! 🎉
