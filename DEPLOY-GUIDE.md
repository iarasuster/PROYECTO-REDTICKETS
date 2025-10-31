# 🚀 Guía de Despliegue: GitHub + Render

## 📋 Pre-requisitos

- [ ] Cuenta en [GitHub](https://github.com)
- [ ] Cuenta en [Render](https://render.com)
- [ ] Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
- [ ] API Key de [Groq](https://console.groq.com) (gratis)

---

## 🗂️ Paso 1: Preparar Variables de Entorno

### Backend (.env)

Copia `backend/.env.example` a `backend/.env` y completa:

```bash
cd backend
cp .env.example .env
```

**Variables obligatorias:**
```env
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
PAYLOAD_SECRET=$(openssl rand -base64 32)
GROQ_API_KEY=gsk_tu_key_aqui
```

### Frontend (.env)

Copia `frontend/.env.example` a `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

**Para desarrollo local:**
```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_API_URL=http://localhost:3000/api/chat
```

---

## 📦 Paso 2: Subir a GitHub

### 2.1 Inicializar Git (si no existe)

```bash
cd /Users/iaruchi/Desktop/PROYECTO\ REDTICKETS

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🎉 Initial commit: RedTickets Blog + Chatbot con Groq"
```

### 2.2 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `redtickets-blog` (o el que prefieras)
3. Descripción: "Blog corporativo con CMS y chatbot inteligente"
4. **Privado** o **Público** (tu elección)
5. **NO inicializar** con README, .gitignore, o license
6. Crear repositorio

### 2.3 Conectar y Hacer Push

```bash
# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/redtickets-blog.git

# Subir código
git branch -M main
git push -u origin main
```

---

## 🚀 Paso 3: Desplegar en Render

### Opción A: Con render.yaml (Recomendado)

1. Ve a https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente `render.yaml`
5. Configura las variables de entorno:
   - `DATABASE_URI`: Tu connection string de MongoDB
   - `GROQ_API_KEY`: Tu API key de Groq
6. Click "Apply"

### Opción B: Manual

#### Backend (Web Service)

1. **New +** → **Web Service**
2. Conectar GitHub repository
3. Configuración:
   ```
   Name: redtickets-backend
   Region: Oregon
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   Plan: Free
   ```

4. **Environment Variables:**
   ```
   DATABASE_URI=mongodb+srv://...
   PAYLOAD_SECRET=<auto-generate>
   GROQ_API_KEY=gsk_...
   CHATBOT_MODEL=llama-3.1-8b-instant
   NODE_ENV=production
   ```

5. **Add Disk:**
   - Name: `media-uploads`
   - Mount Path: `/opt/render/project/src/media`
   - Size: 1GB

6. **Create Web Service**

#### Frontend (Static Site)

1. **New +** → **Static Site**
2. Conectar mismo repositorio
3. Configuración:
   ```
   Name: redtickets-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Environment Variables:**
   ```
   VITE_API_URL=https://redtickets-backend.onrender.com
   VITE_CHAT_API_URL=https://redtickets-backend.onrender.com/api/chat
   VITE_ENABLE_AI_CHAT=true
   ```

5. **Redirects/Rewrites:**
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

6. **Create Static Site**

---

## 🔧 Paso 4: Configurar MongoDB Atlas

### 4.1 Crear Cluster (si no existe)

1. https://www.mongodb.com/cloud/atlas
2. **Build a Database** → **Free (M0)**
3. Provider: AWS
4. Region: Cercana a tu Render region
5. Cluster Name: `redtickets`

### 4.2 Crear Usuario

1. **Database Access** → **Add New Database User**
2. Username: `redtickets`
3. Password: Genera una segura
4. Built-in Role: **Read and write to any database**

### 4.3 Whitelist IPs

1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere**: `0.0.0.0/0`
   (Necesario para Render)

### 4.4 Obtener Connection String

1. **Database** → **Connect** → **Connect your application**
2. Driver: Node.js
3. Copiar connection string:
   ```
   mongodb+srv://redtickets:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
4. Reemplazar `<password>` con tu password real
5. Agregar nombre de database: `/redtickets`

---

## 🤖 Paso 5: Configurar Groq API

1. Ve a https://console.groq.com
2. Sign up / Login (con Google o GitHub)
3. **API Keys** → **Create API Key**
4. Nombre: `RedTickets Chatbot`
5. Copiar la key (empieza con `gsk_`)
6. Agregarla a Render environment variables

---

## ✅ Paso 6: Verificar Deployment

### Backend

1. Abre `https://tu-backend.onrender.com`
2. Deberías ver la landing page de RedTickets
3. Prueba el admin: `https://tu-backend.onrender.com/admin`

### Frontend

1. Abre `https://tu-frontend.onrender.com`
2. Verifica que cargue correctamente
3. Prueba el chatbot (botón flotante)
4. Navega a diferentes secciones

### API Test

```bash
# Test backend API
curl https://tu-backend.onrender.com/api/sections

# Test chatbot
curl -X POST https://tu-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "hola"}]}'
```

---

## 🐛 Troubleshooting

### ❌ "Module not found" en Render

**Solución:** Verifica que `package.json` tenga todas las dependencias

```bash
# En local, verificar:
cd backend && npm install
cd ../frontend && npm install
```

### ❌ Backend devuelve 503

**Causa:** Free tier se duerme después de 15min

**Solución:**
- Espera 30-60 segundos (se despierta automáticamente)
- O upgrade a plan Starter ($7/mo) para mantener siempre activo

### ❌ Frontend no conecta con Backend

**Causa:** URL incorrecta en variables de entorno

**Solución:**
1. Ve a Render Dashboard → Frontend
2. Environment → Verifica `VITE_API_URL`
3. Debe ser: `https://tu-backend.onrender.com` (sin trailing slash)
4. Hacer re-deploy del frontend

### ❌ Chatbot no responde

**Causas posibles:**
1. `GROQ_API_KEY` incorrecta
2. Rate limit de Groq excedido
3. CORS no configurado

**Solución:**
```bash
# Verificar logs en Render
# Dashboard → Backend → Logs

# Buscar errores como:
# "Invalid API key"
# "Rate limit exceeded"
```

### ❌ Error de MongoDB

**Causa:** Connection string incorrecto o IP no whitelistada

**Solución:**
1. MongoDB Atlas → Network Access → Allow 0.0.0.0/0
2. Verificar connection string en Render env vars
3. Asegurar que incluye password y database name

---

## 🔄 Paso 7: Actualizar el Proyecto

### Hacer Cambios

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "✨ Nueva funcionalidad"
git push origin main
```

### Auto-Deploy

Render detectará el push automáticamente y hará re-deploy.

### Deploy Manual

1. Render Dashboard → Service
2. **Manual Deploy** → **Deploy latest commit**

---

## 💰 Costos

### Free Tier

**Backend (Web Service):**
- ✅ 750 horas/mes gratis
- ⚠️ Se duerme después de 15min inactividad
- ⚠️ 100GB bandwidth/mes
- ⚠️ Build time limitado

**Frontend (Static Site):**
- ✅ Completamente gratis
- ✅ Sin límite de requests
- ✅ CDN global incluido

**MongoDB Atlas:**
- ✅ 512MB storage gratis
- ✅ Shared cluster

**Groq API:**
- ✅ Rate limits generosos gratis
- ✅ Suficiente para proyecto personal

### Paid Plans (Opcional)

**Render Starter ($7/mo por servicio):**
- Sin sleep
- Más CPU y RAM
- Despliegues más rápidos

**MongoDB Atlas ($9/mo):**
- Más storage
- Backups automáticos

---

## 📊 Monitoreo

### Logs en Render

```bash
# Ver logs en tiempo real
Dashboard → Service → Logs

# Filtrar por tipo:
- Build logs: Errores de compilación
- Runtime logs: Errores de ejecución
- Access logs: Requests HTTP
```

### Métricas

```bash
# Dashboard → Service → Metrics
- CPU usage
- Memory usage
- Bandwidth
- Request count
```

---

## 🔒 Seguridad

### Variables de Entorno

- ✅ Nunca subas `.env` a GitHub
- ✅ Usa `.env.example` como template
- ✅ Genera `PAYLOAD_SECRET` único
- ✅ Rota API keys periódicamente

### MongoDB

- ✅ Usuario con permisos mínimos necesarios
- ✅ Connection string en env vars
- ✅ Enable IP whitelist en producción

### CORS

Ya configurado en `backend/src/app/api/chat/route.ts`

---

## 📝 Checklist Final

- [ ] Código subido a GitHub
- [ ] Backend desplegado en Render
- [ ] Frontend desplegado en Render
- [ ] MongoDB Atlas configurado
- [ ] Groq API key agregada
- [ ] Variables de entorno configuradas
- [ ] Backend responde (test con curl)
- [ ] Frontend carga correctamente
- [ ] Chatbot funciona
- [ ] Navegación entre secciones funciona
- [ ] Admin panel accesible
- [ ] Logs sin errores críticos

---

## 🆘 Soporte

### Documentación Oficial

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Groq API Docs](https://console.groq.com/docs)
- [Payload CMS Docs](https://payloadcms.com/docs)

### Comunidades

- [Render Community](https://community.render.com/)
- [Payload Discord](https://discord.gg/payload)
- [MongoDB Community](https://www.mongodb.com/community/forums/)

---

## 🎉 ¡Felicidades!

Tu aplicación está en producción. URLs finales:

- **Backend:** `https://redtickets-backend.onrender.com`
- **Frontend:** `https://redtickets-frontend.onrender.com`
- **Admin Panel:** `https://redtickets-backend.onrender.com/admin`

Comparte tu proyecto y recibe feedback de usuarios reales 🚀
