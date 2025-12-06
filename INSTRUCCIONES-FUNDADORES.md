# 📸 Configuración de Fundadores - Instrucciones

## ✅ Cambios Realizados

1. **Backend - Modelo actualizado** (`ContenidoBlog.ts`):
   - ✅ Campo `fundadores_foto` - Para subir la foto grupal
   - ✅ Campo `fundadores` - Array simplificado (nombre + cargo, sin foto individual)

2. **Frontend - Nuevo diseño** (`SectionContent.jsx`):
   - ✅ Foto grupal en formato banner
   - ✅ Grid de 4 cards con nombres y cargos debajo
   - ✅ Iconos de usuario para cada fundador

3. **Estilos** (`SectionContent.css`):
   - ✅ Glassmorphism design
   - ✅ Hover effects en cards
   - ✅ Responsive mobile
   - ✅ Animaciones suaves

4. **Foto subida**: `backend/media/MAU_9637.JPG`

---

## 🚀 PRÓXIMOS PASOS (Manual)

### Opción 1: Desde el Admin Panel (Recomendado)

1. **Iniciar el backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Ir al Admin Panel**: http://localhost:3000/admin

3. **Editar "Sobre Nosotros"**:
   - Ve a "ContenidoBlog" → Busca "sobre_nosotros"
   - Click en "Edit"

4. **Subir la foto grupal**:
   - Busca el campo "Foto Grupal de Fundadores"
   - Click en "Upload" o "Select existing"
   - Busca y selecciona `MAU_9637.JPG`

5. **Actualizar nombres y cargos**:
   - En la sección "Fundadores - Nombres y Cargos"
   - Edita los 4 fundadores con sus nombres reales:
     ```
     Fundador 1:
     - Nombre: [Nombre completo del fundador izquierdo]
     - Cargo: [Ej: CEO y Cofundador]
     
     Fundador 2:
     - Nombre: [Nombre del segundo desde izquierda]
     - Cargo: [Ej: CTO y Cofundador]
     
     Fundador 3:
     - Nombre: [Nombre del tercero]
     - Cargo: [Ej: CFO y Cofundador]
     
     Fundador 4:
     - Nombre: [Nombre del fundador derecho]
     - Cargo: [Ej: COO y Cofundador]
     ```

6. **Guardar** y verificar en: http://localhost:5173/seccion/sobre-nosotros

---

### Opción 2: Con Script (Automático)

Si prefieres actualizar desde código:

1. **Editar el script**:
   ```bash
   nano backend/actualizar-fundadores.js
   ```

2. **Reemplazar los datos** en la línea 20:
   ```javascript
   const fundadores = [
     { nombre: 'Juan Pérez', cargo: 'CEO y Cofundador' },
     { nombre: 'María García', cargo: 'CTO y Cofundadora' },
     { nombre: 'Carlos López', cargo: 'CFO y Cofundador' },
     { nombre: 'Ana Martínez', cargo: 'COO y Cofundadora' },
   ]
   ```

3. **Ejecutar el script**:
   ```bash
   cd backend
   node actualizar-fundadores.js
   ```

4. **Luego** aún debes subir la foto desde el Admin Panel (paso 4 de Opción 1)

---

## 🎨 Resultado Final

La página "Sobre Nosotros" mostrará:

```
┌─────────────────────────────────────────┐
│                                         │
│     [FOTO GRUPAL DE LOS 4 FUNDADORES]   │
│                                         │
└─────────────────────────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│   [👤]     │ │   [👤]     │ │   [👤]     │ │   [👤]     │
│            │ │            │ │            │ │            │
│  Nombre 1  │ │  Nombre 2  │ │  Nombre 3  │ │  Nombre 4  │
│  Cargo 1   │ │  Cargo 2   │ │  Cargo 3   │ │  Cargo 4   │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Features:
- ✨ Foto grupal con border naranja y sombra
- ✨ Hover effect en la foto (se eleva y brilla)
- ✨ Cards con glassmorphism
- ✨ Iconos de usuario con gradiente naranja
- ✨ Hover effects en cada card
- ✨ Responsive (1 columna en móviles)

---

## 🧪 Verificar Funcionamiento

1. Backend corriendo en `http://localhost:3000`
2. Frontend corriendo en `http://localhost:5173`
3. Ir a: `http://localhost:5173/seccion/sobre-nosotros`
4. Scroll hasta la sección "Fundadores"
5. Deberías ver:
   - Foto grupal arriba
   - 4 cards con nombres/cargos abajo

---

## 🐛 Troubleshooting

### La foto no se muestra
→ Verificar en Admin Panel que la foto esté correctamente subida y asociada

### Cards vacías
→ Asegurarse de que el array `fundadores` tenga 4 elementos con nombre y cargo

### Estilos no se aplican
→ Refrescar el navegador (Cmd+Shift+R) para limpiar cache CSS

---

¡Todo listo para personalizar con los datos reales de tus fundadores! 🎉
