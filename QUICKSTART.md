# 🚀 Guía Rápida - Ejecutar Migración Localmente

## Pasos para migrar el contenido de WordPress

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Rensoconese/remax-titanium-intranet.git
cd remax-titanium-intranet

# Cambiar al branch de desarrollo
git checkout claude/astro-wordpress-migration-011CUzJHg27bebQa8PvQvG6c
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Verificar el archivo .env

El archivo `.env` ya está configurado con tus credenciales:

```env
WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
WORDPRESS_USERNAME=rensoconese@gmail.com
WORDPRESS_PASSWORD="rensor FSi7 hGs5 WngR P7RK 1olr TVz6"
```

✅ Ya está listo, no necesitas modificarlo.

### 4️⃣ Ejecutar la migración

```bash
npm run migrate
```

Esto va a:
- 📡 Conectarse a tu WordPress
- ⬇️ Descargar TODO el contenido (cursos, lecciones, tópicos, quizzes, usuarios)
- 💾 Guardarlo en `src/data/` como archivos JSON
- ✅ Mostrarte un resumen de lo que se descargó

### 5️⃣ Verificar los datos

```bash
ls -la src/data/
```

Deberías ver archivos JSON con contenido (no vacíos):
- `courses.json`
- `lessons.json`
- `topics.json`
- `quizzes.json`
- `users.json`
- `media.json`
- `course-structures.json`

### 6️⃣ Probar localmente

```bash
npm run dev
```

Abre: http://localhost:4321/remax-titanium-intranet/

### 7️⃣ Hacer commit de los datos

```bash
git add src/data/
git commit -m "Datos migrados desde WordPress"
git push origin claude/astro-wordpress-migration-011CUzJHg27bebQa8PvQvG6c
```

### 8️⃣ (Opcional) Mergear a main y deployar

Una vez que verifiques que todo funciona:

```bash
git checkout main
git merge claude/astro-wordpress-migration-011CUzJHg27bebQa8PvQvG6c
git push origin main
```

Esto desplegará automáticamente en GitHub Pages.

## 🆘 Problemas comunes

### Error de conexión a WordPress
- Verifica que la URL sea correcta
- Asegúrate de tener acceso a internet
- Verifica que el usuario y contraseña sean correctos

### Error "Cannot find module"
```bash
npm install
```

### Los archivos JSON están vacíos
- No ejecutaste `npm run migrate` todavía
- Hubo un error en la migración, revisa los logs

## 📞 ¿Necesitas ayuda?

Si tienes algún problema, avísame y te ayudo a resolverlo.
