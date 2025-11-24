# 📚 Contenido del Blog - Payload CMS

## Descripción

Este módulo gestiona todo el contenido estructurado del sitio web de RedTickets a través de Payload CMS. El contenido está organizado por secciones y puede ser editado desde el panel de administración o consumido por el frontend y el chatbot mediante la API REST o GraphQL.

---

## 🗂️ Estructura de la Colección

La colección `ContenidoBlog` almacena 6 secciones principales:

1. **Inicio** - Página principal con estadísticas
2. **Sobre Nosotros** - Información del equipo y fundadores
3. **Servicios** - Lista de servicios ofrecidos
4. **Comunidad** - Testimonios y casos de éxito
5. **Ayuda** - FAQs y tutoriales (cómo comprar, cómo vender, políticas, etc.)
6. **Contacto** - Información de contacto y formulario

Cada sección tiene su propia estructura de campos optimizada para su contenido específico.

---

## 🚀 Cargar el Contenido Inicial (Seed)

### Paso 1: Asegúrate que el backend esté compilado

```bash
cd backend
npm run build
```

### Paso 2: Ejecuta el script de seed

```bash
npm run seed
```

El script:

- ✅ Lee el archivo `contenido_blog_redtickets.json`
- ✅ Verifica si cada sección ya existe en la base de datos
- ✅ **Inserta** nuevos documentos si no existen
- ✅ **Actualiza** documentos existentes sin eliminarlos
- ✅ Muestra un resumen al finalizar

### Ejemplo de salida:

```
🌱 Iniciando seed de contenido del blog...

✅ Payload inicializado correctamente

📖 Archivo JSON leído correctamente

📝 Procesando sección: inicio...
✅ Sección "inicio" insertada

📝 Procesando sección: sobre_nosotros...
✅ Sección "sobre_nosotros" insertada

...

==================================================
📊 RESUMEN DEL SEED
==================================================
✅ Documentos insertados: 6
🔄 Documentos actualizados: 0
❌ Errores: 0
==================================================

🎉 ¡Seed completado exitosamente!
```

---

## ✏️ Editar el Contenido desde Payload

### Opción 1: Panel de Administración (Recomendado)

1. Ve a: http://localhost:3000/admin (local) o https://redtickets-backend.onrender.com/admin (producción)
2. Inicia sesión con tu usuario
3. En el menú lateral, busca **"Contenido del Sitio"**
4. Click en **"Contenido Blog"**
5. Verás una lista con las 6 secciones
6. Click en cualquier sección para editarla
7. Modifica los campos que necesites
8. Click en **"Save"** para guardar los cambios

### Campos Condicionales

Los campos se muestran **solo si seleccionas la sección correspondiente**. Por ejemplo:

- Si seleccionas `seccion = "inicio"`, verás los campos: título, descripción, estadísticas, noticias
- Si seleccionas `seccion = "ayuda"`, verás: descripción general, cómo comprar, cómo vender, políticas, etc.

---

## 🔌 Acceder a los Datos (API)

### REST API

#### Obtener todas las secciones:

```http
GET /api/contenido-blog
```

#### Obtener una sección específica:

```http
GET /api/contenido-blog?where[seccion][equals]=inicio
GET /api/contenido-blog?where[seccion][equals]=servicios
GET /api/contenido-blog?where[seccion][equals]=ayuda
```

#### Ejemplo de respuesta (Inicio):

```json
{
  "docs": [
    {
      "id": "abc123",
      "seccion": "inicio",
      "inicio": {
        "titulo": "Creamos experiencias, gestionamos momentos.",
        "descripcion": "En RedTickets acompañamos a productores...",
        "estadisticas": {
          "transacciones": 4000000,
          "eventos_realizados": 20000,
          "productores": 500
        },
        "noticias": "Actualizar a las últimas."
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "page": 1
}
```

### GraphQL API

Endpoint: `/api/graphql`

#### Query para obtener una sección:

```graphql
query {
  ContenidoBlogs(where: { seccion: { equals: "inicio" } }) {
    docs {
      id
      seccion
      inicio {
        titulo
        descripcion
        estadisticas {
          transacciones
          eventos_realizados
          productores
        }
      }
    }
  }
}
```

---

## 🤖 Uso en el Chatbot

El chatbot puede consultar esta información para responder preguntas sobre RedTickets. Ejemplo:

### Consulta desde el backend del chat:

```javascript
// En route.ts del chatbot
const payload = await getPayload({ config })

// Obtener info de servicios
const servicios = await payload.find({
  collection: 'contenido-blog',
  where: {
    seccion: { equals: 'servicios' },
  },
})

const listaServicios = servicios.docs[0].servicios.principales.map((s) => s.servicio).join('\n- ')

// Usar en el prompt del chatbot
const context = `Servicios de RedTickets:\n- ${listaServicios}`
```

---

## 📁 Archivos Importantes

| Archivo                            | Descripción                            |
| ---------------------------------- | -------------------------------------- |
| `contenido_blog_redtickets.json`   | Datos fuente en formato JSON           |
| `seed-contenido.js`                | Script para cargar datos en MongoDB    |
| `src/collections/ContenidoBlog.ts` | Definición de la colección en Payload  |
| `src/payload.config.ts`            | Configuración que incluye la colección |

---

## 🔄 Actualizar el Contenido

### Desde el panel de Payload (Recomendado)

1. Edita directamente en el admin panel
2. Los cambios se reflejan inmediatamente en la API

### Modificando el JSON y re-seeding

1. Edita `contenido_blog_redtickets.json`
2. Ejecuta `npm run seed`
3. El script **actualizará** los documentos existentes

---

## ⚙️ Configuración de Acceso

La colección tiene los siguientes permisos:

- **Read**: Público (cualquiera puede leer via API)
- **Create**: Solo usuarios autenticados
- **Update**: Solo usuarios autenticados
- **Delete**: Solo usuarios autenticados

Esto permite que el frontend y el chatbot consuman los datos sin autenticación, pero solo administradores pueden modificarlos.

---

## 🆘 Troubleshooting

### Error: "Cannot find module './dist/payload.config.js'"

**Solución**: Compila el backend primero

```bash
npm run build
```

### Error: "Collection 'contenido-blog' not found"

**Solución**: Asegúrate que Payload esté inicializado y la colección esté en el config

```bash
npm run generate:types
```

### Los datos no se muestran en el panel

**Solución**: Verifica que el seed se ejecutó correctamente

```bash
npm run seed
```

---

## 📝 Notas Adicionales

- **No se eliminan datos**: El seed siempre actualiza o inserta, nunca elimina
- **Estructura flexible**: Puedes agregar nuevos campos editando `ContenidoBlog.ts`
- **Logs de debugging**: El seed muestra logs detallados de cada operación
- **Backup recomendado**: Antes de re-seedear en producción, haz backup de MongoDB

---

## ✅ Checklist de Implementación

- [x] Colección `ContenidoBlog` creada
- [x] Colección agregada a `payload.config.ts`
- [x] Script `seed-contenido.js` implementado
- [x] Comando `npm run seed` agregado a `package.json`
- [x] JSON copiado al directorio backend
- [x] Permisos de acceso configurados
- [ ] **Ejecutar seed por primera vez**
- [ ] **Verificar datos en el admin panel**
- [ ] **Probar API REST**
- [ ] **Integrar con el chatbot**

---

## 📞 Soporte

Si tienes problemas con el seed o la colección, revisa:

1. Los logs del backend (`npm run dev`)
2. La conexión a MongoDB Atlas
3. Los permisos de usuario en Payload
4. Los tipos generados (`npm run generate:types`)
