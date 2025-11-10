# 🔧 Configuración de Variables de Entorno en Render

## 📋 Variables Requeridas

### Backend (redtickets-backend)

```bash
# MongoDB Atlas
DATABASE_URI=mongodb+srv://usuario:password@cluster.mongodb.net/redtickets?retryWrites=true&w=majority

# Payload CMS
PAYLOAD_SECRET=tu-secret-key-super-segura-aqui

# Groq AI (CRÍTICO para el chatbot)
GROQ_API_KEY=gsk_tu_api_key_de_groq_aqui

# Node Environment
NODE_ENV=production
```

### Frontend (redtickets-frontend)

```bash
# NO se necesitan variables de entorno en el frontend
# La detección del backend es automática según el modo de Vite:
# - Desarrollo: http://localhost:3000/api
# - Producción: https://redtickets-backend.onrender.com/api
```

---

## 🚀 Cómo Configurar en Render

### Backend

1. Ve a tu servicio **redtickets-backend** en Render
2. Click en **"Environment"** en el menú lateral
3. Agregar las siguientes variables:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URI` | Tu connection string de MongoDB Atlas |
| `PAYLOAD_SECRET` | Una clave secreta larga y única |
| `GROQ_API_KEY` | Tu API key de Groq Cloud |
| `NODE_ENV` | `production` |

4. Click en **"Save Changes"**
5. El servicio se reiniciará automáticamente

### Frontend

1. **No se requieren variables de entorno**
2. El código detecta automáticamente el entorno
3. Solo asegúrate que el build command sea: `npm run build`
4. Publish directory: `dist`

---

## 🔍 Verificar que el Chatbot Funciona

### 1. Verificar Backend

```bash
# Hacer request al endpoint de chat
curl -X POST https://redtickets-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

**Respuesta esperada:** Stream de texto con la respuesta del chatbot

### 2. Verificar Frontend

1. Abre: https://redtickets-frontend.onrender.com
2. Click en el botón del chatbot (esquina inferior derecha)
3. Escribe "Hola"
4. Deberías ver una respuesta streaming

### 3. Ver Logs en Render

**Backend:**
- Ve a **redtickets-backend** → **Logs**
- Busca:
  ```
  📤 Enviando request a Groq con X mensajes
  ✅ Stream iniciado correctamente
  ```

**Frontend:**
- Abre DevTools (F12) → Console
- Busca:
  ```
  📤 Enviando mensaje a: https://redtickets-backend.onrender.com/api/chat
  📨 Respuesta recibida: 200 OK
  📦 Content-Type: text/plain; charset=utf-8
  ```

---

## ❌ Troubleshooting

### Error: "API key no configurada"

**Causa:** La variable `GROQ_API_KEY` no está en Render

**Solución:**
1. Obtén tu API key de: https://console.groq.com/keys
2. Agrégala en Render: Environment → `GROQ_API_KEY`
3. Guarda y espera el redeploy

### Error: "Responde en blanco"

**Posibles causas:**
1. ❌ GROQ_API_KEY no configurada → Ver logs del backend
2. ❌ CORS bloqueado → Verificar headers en Network tab
3. ❌ Stream no se lee correctamente → Verificar Content-Type

**Solución:**
- Revisa los logs del backend en Render
- Abre DevTools → Network → Busca la request a `/api/chat`
- Verifica que el status sea 200 y que haya un Response body

### Error: "CORS policy"

**Solución:** Ya está configurado en el código con:
```typescript
'Access-Control-Allow-Origin': '*'
```

Si persiste, verifica que Render no esté bloqueando requests cross-origin.

---

## 📦 Obtener API Key de Groq

1. Ve a: https://console.groq.com
2. Regístrate o inicia sesión
3. Ve a: **API Keys** (https://console.groq.com/keys)
4. Click en **"Create API Key"**
5. Copia la key (empieza con `gsk_`)
6. ⚠️ **IMPORTANTE:** Guárdala de forma segura, solo se muestra una vez

---

## ✅ Checklist Final

- [ ] `DATABASE_URI` configurada en backend
- [ ] `PAYLOAD_SECRET` configurada en backend
- [ ] `GROQ_API_KEY` configurada en backend ⭐ **CRÍTICO**
- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Chatbot responde correctamente en producción
- [ ] No hay errores en los logs

---

## 📞 Soporte

Si después de seguir estos pasos el chatbot sigue sin funcionar:

1. Copia los logs del backend (últimas 50 líneas)
2. Copia los errores del DevTools Console
3. Toma screenshot del Network tab mostrando la request a `/api/chat`
4. Comparte toda la info para debugging
