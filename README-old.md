# Blog Headless con Payload CMS y React

Un blog moderno construido con Payload CMS como backend headless y React como frontend, incluyendo un chatbot básico.

## � Características

- **Backend Headless**: Payload CMS con API REST automática
- **Frontend React**: Aplicación SPA con React Router
- **Base de datos**: MongoDB Cloud (MongoDB Atlas)
- **Chatbot**: Componente de chat interactivo con respuestas predefinidas
- **Responsive**: Diseño adaptativo para móviles y desktop
- **SEO Ready**: Estructura preparada para optimización

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 20.19+ o superior** (IMPORTANTE: Vite y Payload CMS requieren versiones recientes)
- **npm** o **yarn**
- **MongoDB Atlas** (cuenta gratuita)
- **Git**

### ⚠️ Actualizar Node.js

Si tienes una versión anterior de Node.js, actualízala:

```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# O descarga desde https://nodejs.org/
```

npx create-payload-app@latest . --template blank

# Instalar dependencias adicionales

npm install cors dotenv

# Configurar variables de entorno

cp .env.example .env

````

### 2. Frontend con React

```bash
# Navegar al directorio frontend
cd ../frontend

# Crear aplicación React con Vite
npm create vite@latest . -- --template react

# Instalar dependencias
npm install

# Instalar dependencias adicionales para el blog
npm install axios react-router-dom
````

## ⚙️ Configuración

### Backend (Payload CMS)

1. Editar `payload.config.ts` para configurar la colección Posts
2. Configurar CORS para permitir conexiones desde el frontend
3. Habilitar API pública de solo lectura

### Frontend (React)

1. Configurar React Router para navegación
2. Crear servicios para consumir la API de Payload
3. Implementar componentes del blog y chatbot

## 🎯 Componentes Principales

### Backend

- **Colección Posts**: Gestiona el contenido del blog
- **API REST**: Expone endpoints públicos para el frontend

### Frontend

- **BlogList.jsx**: Lista todos los posts
- **BlogPost.jsx**: Vista detalle de un post
- **Chatbot.jsx**: Chatbot con respuestas predefinidas

## 🔧 Comandos de Desarrollo

### Ejecutar Backend

```bash
cd backend
npm run dev
```

- Panel admin: http://localhost:3000/admin
- API: http://localhost:3000/api

### Ejecutar Frontend

```bash
cd frontend
npm run dev
```

- Aplicación: http://localhost:5173

## 📝 Próximos Pasos

1. [ ] Configurar Payload CMS
2. [ ] Crear colección Posts
3. [ ] Configurar frontend React
4. [ ] Implementar componentes del blog
5. [ ] Añadir chatbot básico
6. [ ] Conectar frontend con API

## 🆘 Troubleshooting

### Problemas Comunes

1. **Puerto ocupado**: Cambiar puertos en archivos de configuración
2. **CORS errors**: Verificar configuración en Payload CMS
3. **Dependencias**: Ejecutar `npm install` en ambos directorios

## 📚 Recursos

- [Documentación Payload CMS](https://payloadcms.com/docs)
- [Documentación React](https://react.dev)
- [Documentación Vite](https://vitejs.dev)
