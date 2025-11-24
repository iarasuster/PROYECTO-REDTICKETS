# 🗑️ Archivos para Eliminar - Limpieza del Proyecto

## ❌ Frontend - Componentes NO Usados

### Componentes Legacy de Blog
- `frontend/src/components/BlogList.jsx` - NO usado (no hay ruta de blog posts)
- `frontend/src/components/BlogList.css` - NO usado
- `frontend/src/components/BlogPost.jsx` - Solo usado por PostDetail que tampoco se usa
- `frontend/src/components/BlogPost.css` - NO usado
- `frontend/src/pages/PostDetail.jsx` - NO usado (sin ruta en App.jsx)

### Componentes IA Legacy (LEGACY - marcados en copilot-instructions)
- `frontend/src/ai-assistant/useChatbot.js` - LEGACY (se usa useSimpleChat)
- `frontend/src/ai-assistant/generativeActions.jsx` - LEGACY (no importado)
- `frontend/src/components/GenerativeRenderer.jsx` - LEGACY (usado solo por ChatUI)
- `frontend/src/components/GenerativeRenderer.css` - LEGACY

### Componentes Auxiliares NO Usados
- `frontend/src/components/SearchBar.jsx` - NO usado
- `frontend/src/components/SearchBar.css` - NO usado
- `frontend/src/components/Counter.jsx` - ❌ **MANTENER** (se usa en InicioContent)

### CSS Legacy
- `frontend/src/App-old.css` - Archivo viejo
- `frontend/src/components/SectionContent-old.css` - Si existe

## ❌ Frontend - Data Files NO Usados

- `frontend/src/data/blogData.json` - NO importado
- `frontend/src/data/contenido_blog_redtickets.json` - NO importado
- `frontend/src/data/defaultContent.js` - NO importado

## ❌ Frontend - Test Files

- `frontend/test-parseActions.js` - Script de prueba temporal

## ❌ Backend - Scripts de Utilidad (MANTENER para admin)

Estos son útiles para mantenimiento, SOLO eliminar si confirmas que no los necesitas:
- `backend/insertar-datos-mongo.js` - Script de inserción manual
- `backend/limpiar-y-crear-test.js` - Script de testing
- `backend/verificar-mongo.js` - Script de verificación
- `backend/cleanup-sections.js` - Script de limpieza
- `backend/generateEmbeddings.js` - Script de embeddings (búsqueda semántica)

**MANTENER:**
- `backend/seed-contenido.js` - NECESARIO para seed de datos
- `backend/createAdmin.js` - NECESARIO para crear usuario admin

## ❌ Documentación Redundante

- `IMPLEMENTACION-COMPLETA.md` - Documentación vieja de implementación
- `frontend/FIX-ACTIONS-OCT21.md` - Fix temporal de octubre
- `ESTRUCTURA-PROYECTO.txt` - Si existe y está desactualizado

## ✅ Archivos IMPORTANTES a MANTENER

### Frontend Core
- `frontend/src/App.jsx` ✅
- `frontend/src/pages/Home.jsx` ✅
- `frontend/src/pages/SectionPage.jsx` ✅
- `frontend/src/components/SectionContent.jsx` ✅
- `frontend/src/components/Chatbot.jsx` ✅
- `frontend/src/components/ChatUI.jsx` ✅
- `frontend/src/components/ChromaGrid.jsx` ✅
- `frontend/src/components/CommentsForm.jsx` ✅
- `frontend/src/components/CommentsList.jsx` ✅
- `frontend/src/components/CommentsSection.jsx` ✅
- `frontend/src/components/Counter.jsx` ✅
- `frontend/src/components/LiquidEther.jsx` ✅ (usado en Home)
- `frontend/src/hooks/useSimpleChat.js` ✅

### Backend Core
- `backend/src/**` - Todo el código de Payload CMS ✅
- `backend/seed-contenido.js` ✅
- `backend/createAdmin.js` ✅

### Documentación Core
- `README.md` ✅
- `.github/copilot-instructions.md` ✅
- `GUIA-RAPIDA.md` ✅
- `DEPLOY-GUIDE.md` ✅
- `RENDER-ENV-SETUP.md` ✅
