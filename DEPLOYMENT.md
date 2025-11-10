# Guía de Despliegue en GitHub Pages

## 🚀 Configuración inicial

### 1. Configurar Secrets en GitHub

Ve a tu repositorio en GitHub: `Settings > Secrets and variables > Actions` y agrega los siguientes secrets:

- `WORDPRESS_API_URL`: `https://intranet.remax-titanium.com.ar/wp-json`
- `WORDPRESS_USERNAME`: Tu usuario de WordPress
- `WORDPRESS_PASSWORD`: Tu contraseña de WordPress

### 2. Habilitar GitHub Pages

1. Ve a `Settings > Pages`
2. En "Source", selecciona **GitHub Actions**

### 3. Deploy automático

El sitio se desplegará automáticamente cuando:
- Hagas push a la rama `main` o `master`
- Ejecutes manualmente el workflow desde `Actions > Deploy to GitHub Pages > Run workflow`

## 📋 Cómo funciona

### Build estático

El proyecto ahora genera un sitio **completamente estático** que:

1. **Durante el build** (en GitHub Actions):
   - Se conecta a la API de WordPress
   - Descarga todos los cursos, lecciones y tópicos
   - Pre-renderiza todas las páginas HTML
   - Genera un sitio estático en la carpeta `dist/`

2. **En producción** (GitHub Pages):
   - Sirve archivos HTML estáticos
   - No necesita servidor Node.js
   - Carga instantánea
   - Sin llamadas API en tiempo real

### Ventajas del enfoque estático

✅ **Rápido**: Todo el contenido está pre-renderizado
✅ **Gratuito**: GitHub Pages es gratis
✅ **Simple**: No requiere mantenimiento de servidor
✅ **Seguro**: No expone credenciales de WordPress

### Limitaciones

⚠️ **Contenido estático**: Si actualizas contenido en WordPress, debes:
   - Hacer push a GitHub (cualquier cambio), o
   - Ejecutar el workflow manualmente desde Actions

⚠️ **Sin funcionalidades dinámicas**:
   - No hay login/logout real (se puede simular con localStorage)
   - El progreso de usuario se guarda en el navegador
   - No hay base de datos en tiempo real

## 🔄 Actualizar el sitio

### Método 1: Push automático
```bash
git add .
git commit -m "Actualizar contenido"
git push origin main
```

### Método 2: Workflow manual
1. Ve a `Actions` en GitHub
2. Selecciona "Deploy to GitHub Pages"
3. Click en "Run workflow"
4. Selecciona la rama y click en "Run workflow"

## 🌐 URL del sitio

Tu sitio estará disponible en:
```
https://rensoconese.github.io/remax-titanium-intranet/
```

## 🛠️ Build local

Para probar el build localmente antes de hacer deploy:

```bash
# Instalar dependencias
npm install

# Build
npm run build

# Preview del build
npm run preview
```

El preview estará disponible en `http://localhost:4321/remax-titanium-intranet/`

## 📊 Monitorear el deploy

1. Ve a la pestaña `Actions` en GitHub
2. Verás el progreso del workflow "Deploy to GitHub Pages"
3. Si hay errores, revisa los logs para diagnosticar

## 🔧 Troubleshooting

### El sitio no carga o muestra 404
- Verifica que GitHub Pages esté configurado en `Settings > Pages`
- Verifica que el source sea "GitHub Actions"
- Espera unos minutos después del primer deploy

### Error en el build
- Revisa que los secrets estén configurados correctamente
- Verifica los logs en la pestaña Actions
- Asegúrate de que WordPress sea accesible desde GitHub

### Las rutas no funcionan
- Verifica que el `base` en `astro.config.mjs` sea correcto
- El base debe ser `/remax-titanium-intranet` (el nombre del repo)

### Contenido desactualizado
- Ejecuta el workflow manualmente desde Actions
- O haz cualquier cambio y push para trigger el build

## 🎯 Próximos pasos opcionales

### Deploy en dominio personalizado

Si quieres usar un dominio propio (ej: `intranet.remax-titanium.com.ar`):

1. Agrega un archivo `public/CNAME` con tu dominio:
   ```
   intranet.remax-titanium.com.ar
   ```

2. Configura DNS en tu proveedor:
   ```
   CNAME @ rensoconese.github.io
   ```

3. Actualiza `astro.config.mjs`:
   ```js
   site: 'https://intranet.remax-titanium.com.ar',
   base: '/',
   ```

### Programar builds automáticos

Para actualizar el sitio automáticamente cada día, agrega esto al workflow:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM todos los días
```
