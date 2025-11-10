# Guía de Migración Completa de WordPress a Astro

## 🎯 Objetivo

Este proyecto realiza una **migración completa** del contenido de WordPress/LearnDash a Astro. No es una integración con API en tiempo real, sino una migración total donde todo el contenido se descarga y queda versionado en el repositorio.

## 📋 ¿Qué significa "Migración Completa"?

### Antes (❌ No hacemos esto):
- El sitio hace llamadas a WordPress API en cada build
- Dependencia continua de WordPress
- Si WordPress cae, el sitio no se puede construir

### Ahora (✅ Hacemos esto):
- **Una sola vez**: Descargamos TODO el contenido de WordPress
- El contenido se guarda en archivos JSON locales en `src/data/`
- El proyecto se vuelve **completamente independiente** de WordPress
- Todo el contenido está **versionado en Git**
- GitHub Pages sirve un sitio 100% estático

## 🚀 Proceso de Migración

### Paso 1: Configurar Credenciales

Asegúrate de tener tu archivo `.env` configurado:

```env
WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
WORDPRESS_USERNAME=tu_usuario@email.com
WORDPRESS_PASSWORD=tu_contraseña
```

### Paso 2: Ejecutar la Migración

```bash
npm run migrate
```

Este comando:
1. 📡 Se conecta a tu WordPress
2. ⬇️ Descarga TODO el contenido:
   - Todos los cursos
   - Todas las lecciones
   - Todos los tópicos
   - Todos los quizzes
   - Todos los usuarios
   - Todas las imágenes destacadas
3. 💾 Guarda todo en `src/data/` como archivos JSON
4. ✅ El proyecto ahora es independiente

### Paso 3: Verificar la Migración

Revisa los archivos generados en `src/data/`:

```
src/data/
├── courses.json              # Todos los cursos
├── lessons.json              # Todas las lecciones
├── topics.json               # Todos los tópicos
├── quizzes.json              # Todos los quizzes
├── users.json                # Todos los usuarios
├── media.json                # Metadatos de imágenes
├── course-structures.json    # Estructura completa de cursos
└── migration-metadata.json   # Información de la migración
```

### Paso 4: Desarrollar Localmente

```bash
npm run dev
```

El sitio ahora lee de los archivos locales, no de WordPress.

### Paso 5: Build y Deploy

```bash
npm run build
npm run preview
```

O simplemente haz push a GitHub y GitHub Actions se encarga del deploy.

## 🔄 Actualizar Contenido

### Opción 1: Re-migrar

Si actualizas contenido en WordPress:

```bash
# 1. Ejecutar migración nuevamente
npm run migrate

# 2. Commit los cambios
git add src/data/
git commit -m "Actualizar contenido desde WordPress"
git push
```

### Opción 2: Editar Manualmente

Como todo está en JSON, puedes editar directamente:

```bash
# Edita src/data/courses.json, lessons.json, etc.
# Luego commit y push
```

## 📊 Estructura de Datos

### Cursos (courses.json)
```json
[
  {
    "id": 123,
    "title": { "rendered": "Nombre del Curso" },
    "content": { "rendered": "<p>Contenido HTML...</p>" },
    "course_price_type": "free",
    "featured_media": 456,
    ...
  }
]
```

### Estructura Completa (course-structures.json)
```json
[
  {
    "course": { /* curso completo */ },
    "lessons": [
      {
        "lesson": { /* lección */ },
        "topics": [ /* tópicos de la lección */ ],
        "quizzes": [ /* quizzes de la lección */ ]
      }
    ],
    "course_quizzes": [ /* quizzes del curso */ ]
  }
]
```

## 🔧 Arquitectura Técnica

### Cliente de Datos Local

El archivo `src/lib/local-data.ts` proporciona una interfaz para leer los datos locales:

```typescript
import { localData } from '@/lib/local-data';

// Obtener todos los cursos
const courses = await localData.getCourses();

// Obtener un curso específico
const course = await localData.getCourse(123);

// Obtener estructura completa de curso
const structure = await localData.getCourseStructure(123);
```

### Generación de Rutas Estáticas

Cada página dinámica usa `getStaticPaths()`:

```typescript
export async function getStaticPaths() {
  const courses = await localData.getCourses();
  return courses.map((course) => ({
    params: { id: course.id.toString() },
  }));
}
```

Esto le dice a Astro qué páginas generar en build time.

## 🎉 Ventajas de este Enfoque

### ✅ Independencia Total
- No necesitas WordPress funcionando para hacer build
- El sitio es completamente autocontenido

### ✅ Versionado en Git
- Todo el contenido está en Git
- Puedes ver cambios con `git diff`
- Rollback fácil a versiones anteriores

### ✅ Performance
- Cero latencia de API
- Todo es estático y pre-renderizado
- Súper rápido en GitHub Pages

### ✅ Seguridad
- No expones WordPress públicamente
- No hay llamadas API en producción
- Menos superficie de ataque

### ✅ Portabilidad
- Puedes desplegar en cualquier host estático
- No dependencias de servidor
- Compatible con GitHub Pages, Netlify, Vercel, etc.

## ⚠️ Consideraciones

### Contenido Estático
- El contenido no se actualiza automáticamente
- Debes re-migrar o editar manualmente para actualizar

### Tamaño del Repositorio
- Los archivos JSON se versiona en Git
- Si tienes MUCHO contenido, el repo crecerá
- Solución: Usar Git LFS si es necesario

### Sin Funcionalidades Dinámicas
- No hay login/logout real con WordPress
- El progreso de usuario se maneja en el navegador (localStorage)
- Para funcionalidades dinámicas, necesitas agregar un backend

## 🔮 Próximos Pasos

1. **Migración Automática Programada** (opcional)
   - Configurar GitHub Actions para re-migrar diariamente
   - Auto-commit de cambios

2. **Sistema de Autenticación Local**
   - Implementar login con localStorage
   - Sincronizar progreso entre dispositivos con backend ligero

3. **CMS Headless** (opcional)
   - Migrar a un CMS headless moderno (Strapi, Contentful, etc.)
   - Mantener la arquitectura estática

## 📞 Soporte

Si tienes dudas sobre la migración:
- Revisa los logs de `npm run migrate`
- Verifica los archivos en `src/data/`
- Asegúrate de que WordPress sea accesible

---

**¡Feliz migración! 🚀**
