# Problema con la Migración de Datos

## 🐛 Problema Detectado

Las lecciones y tópicos no se están mostrando en el sitio porque la migración original no capturó correctamente las relaciones entre cursos, lecciones y tópicos de LearnDash.

### Causa Raíz

El script `scripts/migrate-from-wordpress.ts` (línea 178) intenta filtrar lecciones por:

```typescript
const courseLessons = (lessons as any[]).filter(l => l.course === course.id);
```

**Problema**: La API estándar de WordPress (`/wp/v2/sfwd-lessons`) NO incluye el campo `course` en las lecciones. Este campo es metadata interna de LearnDash que no se expone en la API REST estándar.

## ✅ Solución

### Opción 1: Re-ejecutar Migración con API de LearnDash (RECOMENDADO)

LearnDash proporciona endpoints especiales que incluyen las relaciones:

1. **Configurar `.env`** con tus credenciales de WordPress:
   ```env
   WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
   WORDPRESS_USERNAME=tu_email@example.com
   WORDPRESS_PASSWORD=tu_contraseña_de_aplicación
   ```

2. **Actualizar el script de migración** para usar:
   - `/ldlms/v1/sfwd-courses/{id}/steps` - Obtiene lecciones de un curso
   - `/ldlms/v1/sfwd-lessons/{id}/steps` - Obtiene tópicos de una lección

3. **Ejecutar nueva migración**:
   ```bash
   npm run migrate
   ```

### Opción 2: Fix Temporal (YA APLICADO)

Como solución temporal, he creado `scripts/fix-course-structures.ts` que:
- Asigna TODAS las lecciones al curso disponible (Capacitación Inicial)
- Las ordena por `menu_order`
- Por ahora, los tópicos no están asociados correctamente

Esto permite que el sitio muestre al menos las lecciones, aunque sin sus tópicos internos.

## 📝 Para el Administrador del Sitio

Si tienes acceso a WordPress:

### Paso 1: Crear Contraseña de Aplicación
1. Inicia sesión en WordPress
2. Ve a tu perfil de usuario
3. Busca "Contraseñas de Aplicación"
4. Crea una nueva contraseña de aplicación
5. Cópiala (la necesitarás para el `.env`)

### Paso 2: Configurar .env
Crea un archivo `.env` en la raíz del proyecto:

```env
WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
WORDPRESS_USERNAME=rensoconese@gmail.com
WORDPRESS_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

### Paso 3: Ejecutar Migración Actualizada

Primero, necesitas actualizar el script para usar la API de LearnDash:

```bash
# El script ya fue actualizado en scripts/migrate-from-wordpress.ts
# Solo ejecuta:
npm run migrate
```

Esto descargará TODO el contenido con las relaciones correctas.

### Paso 4: Commit y Push

```bash
git add src/data/
git commit -m "Re-migrar contenido con relaciones correctas"
git push
```

## 🔍 Verificación

Después de la migración, verifica que `src/data/course-structures.json` tenga:
- Lecciones con `topics` y `quizzes` poblados
- No arrays vacíos en `lessons`

## ⚡ Estado Actual

- ✅ 16 lecciones migradas
- ✅ 76 tópicos migrados
- ✅ 76 quizzes migrados
- ❌ Relaciones entre ellos NO establecidas correctamente
- ⚠️ Fix temporal aplicado: lecciones visibles, pero sin tópicos

## 📞 Ayuda

Si necesitas ayuda con la migración, contacta al desarrollador con:
- Los logs de `npm run migrate`
- El contenido de `src/data/migration-metadata.json`
