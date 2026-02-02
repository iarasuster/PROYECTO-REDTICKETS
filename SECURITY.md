# 🛡️ Guía de Seguridad para Contribuidores

## 🔐 Variables de Entorno

### ❌ NUNCA commitear

- Archivos `.env`, `.env.local`, `.env.production`
- API Keys reales
- Passwords o secretos
- Connection strings con credenciales

### ✅ Usar siempre

- `backend/.env.example` - plantilla sin valores reales
- `frontend/.env.example` - plantilla sin valores reales
- Variables de entorno en tu sistema local

---

## 🔑 Obtener Credenciales

### MongoDB Atlas (Base de Datos)

1. Crear cuenta gratuita: https://www.mongodb.com/cloud/atlas/register
2. Crear cluster (M0 Free)
3. Database Access → Add User → Crear usuario con password
4. Network Access → Add IP → Agregar tu IP o 0.0.0.0/0 (solo desarrollo)
5. Clusters → Connect → Copy connection string
6. Reemplazar `<password>` con tu password

```env
DATABASE_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Groq API (IA del Chatbot)

1. Crear cuenta: https://console.groq.com/
2. API Keys → Create API Key
3. Copiar la key (empieza con `gsk_`)

```env
GROQ_API_KEY=gsk_tu_key_aqui
```

### Payload CMS Secret

Generar un secret aleatorio:

```bash
openssl rand -base64 32
```

```env
PAYLOAD_SECRET=resultado-del-comando-anterior
```

---

## 🚫 Qué NO es Secreto

Estos elementos **NO son vulnerabilidades** y SÍ se pueden publicar:

### ✅ System Prompts del Chatbot

Los prompts del chatbot están en el código y **es correcto que estén públicos**. No reducen la seguridad:

- `backend/src/app/api/chat-structured/route.ts`

### ✅ Arquitectura de Respuestas

La estructura de respuestas (archetypes, layers) es diseño público:

- Documentación de arquetipos
- Parsers de JSON estructurado
- Componentes de Generative UI

### ✅ Endpoints y API

Los endpoints son públicos por diseño:

- `/api/contenido-blog`
- `/api/chat-structured`
- `/api/comments`

La seguridad está en:

- Autenticación (JWT tokens)
- Rate limiting
- Validación de inputs
- NO en ocultar endpoints

---

## 🔍 Antes de Cada Commit

Ejecuta este checklist:

```bash
# 1. Verificar que no haya archivos .env en staging
git status | grep ".env"

# 2. Verificar que no haya secrets en el diff
git diff --cached | grep -i "api_key\|password\|secret"

# 3. Si aparece algo sospechoso, usar:
git reset HEAD archivo_con_secret.env
```

---

## 🚨 Si Accidentalmente Commiteaste un Secret

**NO HAGAS `git push`** todavía. Hay dos opciones:

### Opción 1: Secret en el último commit (más fácil)

```bash
# 1. Deshacer el último commit (mantiene cambios)
git reset --soft HEAD~1

# 2. Remover el archivo del staging
git reset HEAD archivo_con_secret

# 3. Hacer commit sin el archivo secreto
git add .
git commit -m "mensaje"
```

### Opción 2: Secret en commits anteriores (requiere reescribir historial)

```bash
# ⚠️ CUIDADO: Reescribe historial de Git

# 1. Usar BFG Repo Cleaner (recomendado)
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. O git filter-branch (avanzado)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch ruta/al/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Después de limpiar el historial:

```bash
# 1. Forzar push (SOLO si no compartiste el repo)
git push origin --force --all

# 2. ROTAR TODAS LAS CREDENCIALES EXPUESTAS:
#    - Cambiar password MongoDB
#    - Regenerar Groq API Key
#    - Regenerar Payload Secret
```

---

## 🎯 Recomendaciones de Seguridad

### 1. Usa .env solo para desarrollo local

Nunca uses `.env` en producción. En Render/Vercel:

- Configura variables en el dashboard
- Usa secrets managers

### 2. Principio de Mínimo Privilegio

MongoDB users deben tener **solo** los permisos necesarios:

- ✅ `readWrite` en database específica
- ❌ NO `admin` o `root`

### 3. IP Whitelisting

En MongoDB Atlas:

- Desarrollo: Tu IP específica
- Producción: IP del servidor (Render)
- ❌ Evitar `0.0.0.0/0` en producción

### 4. Rotación de Credenciales

Rota credenciales:

- Cada 90 días (buena práctica)
- Inmediatamente si sospechas compromiso
- Antes de hacer un repo público

### 5. Monitoreo

Habilita en GitHub:

- **Dependabot** - updates automáticos de seguridad
- **Secret scanning** - detecta secrets commiteados
- **Code scanning** - análisis estático de seguridad

---

## 📞 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO abras un issue público**
2. Contacta directamente al maintainer
3. Provee detalles: versión, pasos para reproducir, impacto

---

## ✅ Checklist de Seguridad Pre-Deploy

Antes de desplegar a producción:

- [ ] Todas las credenciales en variables de entorno (no hardcoded)
- [ ] `.env` en `.gitignore`
- [ ] `.env.example` sin valores reales
- [ ] MongoDB: IP whitelist configurada
- [ ] MongoDB: Usuario con permisos mínimos
- [ ] Groq API: Key rotada si se expuso
- [ ] CORS configurado para dominios específicos
- [ ] HTTPS habilitado en producción
- [ ] Dependencias actualizadas (`npm audit`)
- [ ] Tests de seguridad pasando

---

Este documento es parte del proyecto RedTickets Blog. Actualizado: Enero 24, 2026.
