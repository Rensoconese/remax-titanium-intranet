# 🚀 Instrucciones para Re-migrar con Relaciones Correctas

## ✅ El Script Ya Está Actualizado

El script `scripts/migrate-from-wordpress.ts` ahora usa la API correcta de LearnDash para obtener las relaciones reales entre cursos, lecciones y tópicos.

---

## 📋 Pasos para Ejecutar la Migración

### Paso 1: Crear Contraseña de Aplicación en WordPress

1. Ve a tu WordPress: https://intranet.remax-titanium.com.ar/wp-admin
2. Ve a tu perfil de usuario (arriba a la derecha → "Editar mi perfil")
3. Baja hasta la sección **"Contraseñas de Aplicación"**
4. Crea una nueva contraseña de aplicación:
   - Nombre: "Migración Astro" (o el nombre que quieras)
   - Click en "Añadir nueva contraseña de aplicación"
5. **Copia la contraseña generada** (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)
   - ⚠️ Solo la podrás ver una vez, guárdala bien

### Paso 2: Configurar el Archivo .env

En la raíz del proyecto, crea un archivo `.env` con este contenido:

```env
WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
WORDPRESS_USERNAME=rensoconese@gmail.com
WORDPRESS_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

Reemplaza `xxxx xxxx xxxx xxxx xxxx xxxx` con la contraseña que copiaste en el paso anterior.

⚠️ **IMPORTANTE**: El archivo `.env` ya está en `.gitignore`, no se subirá al repositorio.

### Paso 3: Ejecutar la Migración

```bash
npm run migrate
```

Este comando va a:
1. 📡 Conectarse a WordPress
2. ⬇️ Descargar todos los cursos, lecciones, tópicos y quizzes
3. 🔗 Usar la API de LearnDash para obtener las relaciones correctas
4. 💾 Guardar todo en `src/data/` con las relaciones reales
5. ✅ Mostrar un resumen al final

### Paso 4: Verificar los Resultados

Al terminar, deberías ver algo como:

```
✨ ¡Migración completada exitosamente!

📊 Resumen:
   • 1 cursos
   • 16 lecciones
   • 76 tópicos
   • 76 quizzes
   • X usuarios
   • X archivos multimedia

📁 Todo guardado en: src/data/
```

Y en la salida deberías ver las lecciones con sus tópicos reales, por ejemplo:

```
  📚 Procesando: Capacitación Inicial
  🔍 Obteniendo estructura desde LearnDash API...
  📖 Encontrados 16 pasos/lecciones vía LearnDash API
    ✓ Fuentes de Información: 3 tópicos, 1 quizzes
    ✓ Marketing en Redes Sociales: 5 tópicos, 0 quizzes
    ✓ Clientes Vendedores: 4 tópicos, 2 quizzes
    ...
```

### Paso 5: Verificar Archivos Actualizados

Revisa que `src/data/course-structures.json` ahora tenga lecciones con tópicos reales:

```bash
cat src/data/course-structures.json | grep -A 5 '"topics"'
```

Deberías ver arrays de tópicos con contenido, no vacíos.

### Paso 6: Subir los Cambios

```bash
git add src/data/
git commit -m "Re-migrar contenido con relaciones correctas de LearnDash"
git push
```

---

## 🔍 Qué Hace el Script Actualizado

### Antes (Método Antiguo - INCORRECTO):
```typescript
// Intentaba filtrar por campos que no existen
const courseLessons = lessons.filter(l => l.course === course.id); // ❌ No funciona
```

### Ahora (Método Nuevo - CORRECTO):
```typescript
// Usa la API específica de LearnDash
const courseSteps = await fetchAPI(`/ldlms/v1/sfwd-courses/${course.id}/steps`);
// Esto devuelve las lecciones en el orden correcto con sus IDs

// Para cada lección, obtiene sus tópicos:
const lessonSteps = await fetchAPI(`/ldlms/v1/sfwd-lessons/${lesson.id}/steps`);
// Esto devuelve los tópicos y quizzes en el orden correcto
```

---

## ❓ Problemas Comunes

### Error: "API error: 401 Unauthorized"
- Verifica que la contraseña de aplicación esté correcta en `.env`
- Verifica que el email sea el correcto
- Asegúrate de que no haya espacios extra al copiar la contraseña

### Error: "API error: 404 Not Found"
- El endpoint de LearnDash puede no estar disponible
- El script usará automáticamente un fallback (mostrará advertencia)
- Contacta al administrador de WordPress

### Error: "Cannot find module 'dotenv'"
```bash
npm install
```

---

## 📞 Después de la Migración

Una vez que hayas ejecutado la migración exitosamente:

1. ✅ Las lecciones tendrán sus tópicos reales asociados
2. ✅ Los tópicos estarán en las lecciones correctas
3. ✅ El orden será el mismo que en WordPress/LearnDash
4. ✅ GitHub Actions rebuildeará el sitio automáticamente al hacer push

---

## 🎉 ¡Listo!

Después de esto, el sitio tendrá todas las relaciones correctas y los tópicos estarán en las lecciones que corresponden.
