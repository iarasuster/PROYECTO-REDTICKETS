# Guía de Instalación Rápida - Blog Headless

## ⚡ Inicio Rápido

### 1. Actualizar Node.js (OBLIGATORIO)

```bash
# Verificar versión actual
node --version

# Si es menor a 20.19, actualizar:
# Opción 1: Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Opción 2: Descargar desde https://nodejs.org/
```

### 2. Configurar Backend

```bash
cd backend
npm install
npm run dev
```

**URL Admin**: http://localhost:3001/admin (crear usuario la primera vez)

### 3. Configurar Frontend (Nueva Terminal)

```bash
cd frontend
npm install
npm run dev
```

**URL Blog**: http://localhost:5173

## 🎯 Primera Prueba

1. Ve al admin: http://localhost:3001/admin
2. Crea tu usuario administrador
3. Crea un post en "Posts" → "Create New"
4. Marca "Publicado" ✅
5. Ve al blog: http://localhost:5173
6. ¡Deberías ver tu post!
7. Prueba el chatbot 💬

## 🔧 Si hay Problemas

### Error de Node.js

```
You are using Node.js 18.12.0...
```

→ **Actualizar Node.js a 20.19+**

### Error "Cannot connect to API"

→ Verificar que backend esté en puerto 3001

### Posts no aparecen

→ Verificar que esté marcado como "Publicado"

## 📝 Estructura Creada

```
backend/
├── src/collections/Posts.ts    # Colección de posts con todos los campos
├── payload.config.ts           # Configuración con MongoDB
└── .env                       # Variables de entorno

frontend/
├── src/components/
│   ├── BlogList.jsx           # Lista de posts
│   ├── BlogPost.jsx           # Detalle de post
│   └── Chatbot.jsx            # Chat interactivo
├── src/services/api.js        # Conexión con Payload API
└── App.jsx                    # Router y estructura
```

## 🚀 ¡Listo para usar!

Tu blog headless está completo con:

- ✅ CMS administrativo
- ✅ API REST automática
- ✅ Frontend React responsive
- ✅ Chatbot funcional
- ✅ MongoDB Atlas conectado
