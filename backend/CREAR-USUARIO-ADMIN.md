# 🔐 Crear Usuario Administrador en Payload CMS

## Opción 1: Interfaz Web (Más Fácil) ⭐

Si **NO existe ningún usuario** en la base de datos:

1. Ve a: http://localhost:3000/admin (local) o https://redtickets-backend.onrender.com/admin (producción)
2. Payload detectará que no hay usuarios y te mostrará un formulario para crear el primero
3. Ingresa:
   - **Email:** tu@email.com
   - **Password:** mínimo 8 caracteres
4. Click en "Create"
5. ¡Listo! Ya puedes iniciar sesión

---

## Opción 2: Desde MongoDB Atlas (Si ya existe un usuario pero olvidaste la contraseña)

1. Ve a: https://cloud.mongodb.com
2. Selecciona tu cluster
3. Click en "Browse Collections"
4. Busca la colección `users`
5. Elimina el usuario existente (o todos)
6. Vuelve a la **Opción 1** para crear uno nuevo

---

## Opción 3: Usando MongoDB Compass

1. Abre MongoDB Compass
2. Conecta con tu connection string
3. Ve a la base de datos `redtickets` (o el nombre que uses)
4. Busca la colección `users`
5. Elimina los documentos existentes
6. Vuelve a la **Opción 1**

---

## ❌ Error: "You are not allowed to perform this action"

**Causa:** No has iniciado sesión o tu sesión expiró

**Solución:**
1. Ve a: `/admin/logout` para cerrar sesión
2. Luego ve a: `/admin/login`
3. Ingresa tus credenciales
4. Si olvidaste la contraseña → usar **Opción 2** o **Opción 3**

---

## 🔍 Verificar si existe un usuario

### Local (con terminal):

```bash
cd backend
node -e "
const { getPayload } = require('payload');
const config = require('./dist/payload.config.js').default;

(async () => {
  const payload = await getPayload({ config });
  const users = await payload.find({ collection: 'users' });
  console.log('Usuarios encontrados:', users.totalDocs);
  if (users.totalDocs > 0) {
    console.log('Emails:', users.docs.map(u => u.email));
  }
  process.exit(0);
})();
"
```

### Desde MongoDB Atlas:

1. Browse Collections → `users`
2. Si hay documentos = hay usuarios
3. Si está vacío = puedes crear el primero desde `/admin`

---

## 🚀 Inicio Rápido (Recomendado)

**Si estás trabajando en LOCAL:**

1. Asegúrate que el backend esté corriendo: `npm run dev`
2. Ve a: http://localhost:3000/admin
3. Si no puedes entrar, elimina las cookies del navegador (DevTools → Application → Clear site data)
4. Refresca la página
5. Deberías ver el formulario de login o de crear primer usuario

**Si estás en PRODUCCIÓN (Render):**

1. Ve a: https://redtickets-backend.onrender.com/admin
2. Sigue los mismos pasos

---

## 💡 Tips

- **El primer usuario** siempre es administrador automáticamente
- **Los siguientes usuarios** necesitan que les asignes permisos
- **La sesión expira** después de cierto tiempo, solo vuelve a iniciar sesión
- **Si cambias la base de datos**, tendrás que crear el usuario otra vez

---

## ✅ Checklist

- [ ] Backend corriendo (local o en Render)
- [ ] Base de datos MongoDB conectada
- [ ] Ir a `/admin`
- [ ] Crear primer usuario (si no existe)
- [ ] Iniciar sesión
- [ ] Ya puedes agregar/editar contenido

---

## 🆘 Si Nada Funciona

1. Verifica que `DATABASE_URI` esté correcta en `.env` (local) o en variables de entorno de Render
2. Verifica los logs del backend para ver errores de conexión
3. Intenta eliminar la colección `users` completamente desde MongoDB Atlas
4. Reinicia el backend y vuelve a `/admin`
