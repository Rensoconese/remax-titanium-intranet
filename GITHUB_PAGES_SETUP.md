# 🚀 Configuración de GitHub Pages - Paso a Paso

## ✅ El proyecto ya está listo

El código está pusheado y el workflow de GitHub Actions está configurado. Solo necesitas activar GitHub Pages desde la interfaz de GitHub.

## 📋 Pasos para activar GitHub Pages:

### 1. Ve a tu repositorio en GitHub

Abre: https://github.com/Rensoconese/remax-titanium-intranet

### 2. Ve a Settings (Configuración)

- Click en la pestaña **Settings** (arriba a la derecha)

### 3. Activa GitHub Pages

- En el menú lateral izquierdo, busca y click en **Pages**
- En "Build and deployment":
  - **Source**: Selecciona **GitHub Actions**
  - ✅ Listo! No necesitas configurar nada más

### 4. Ejecutar el deployment manualmente (primera vez)

Ve a la pestaña **Actions**:
- Click en **Actions** (arriba)
- Verás el workflow "Deploy to GitHub Pages"
- Click en "Run workflow" (botón verde a la derecha)
- Selecciona el branch: `claude/astro-wordpress-migration-011CUzJHg27bebQa8PvQvG6c`
- Click en "Run workflow"

### 5. Espera a que termine el deployment

- Verás un círculo amarillo girando → en progreso
- Cuando se ponga verde ✅ → completado
- Si hay error ❌ → revisa los logs

### 6. ¡Accede a tu sitio!

Una vez completado, tu sitio estará disponible en:

```
https://rensoconese.github.io/remax-titanium-intranet/
```

## 📊 Verificar que todo funcione

Abre la URL y deberías ver:
- ✅ Página de inicio con el curso "Capacitación Inicial"
- ✅ Navegación funcionando
- ✅ Contenido completo migrado de WordPress

## 🔄 Deployments futuros

Después de la configuración inicial, el sitio se desplegará automáticamente cuando:
- Hagas push al branch `claude/astro-wordpress-migration-011CUzJHg27bebQa8PvQvG6c`
- O ejecutes el workflow manualmente desde Actions

## 🆘 Si algo no funciona

### El sitio muestra 404
- Espera 2-3 minutos después del primer deployment
- Verifica que GitHub Pages esté activado en Settings > Pages
- Verifica que el Source sea "GitHub Actions"

### El workflow falla
- Ve a Actions y revisa los logs del error
- Verifica que los archivos de datos estén en `src/data/`
- Asegúrate de que `npm run build` funcione localmente

### Las rutas no funcionan
- Verifica que `astro.config.mjs` tenga:
  ```js
  site: 'https://rensoconese.github.io',
  base: '/remax-titanium-intranet',
  ```

## 🎯 Resumen rápido

1. **Settings** → **Pages** → Source: **GitHub Actions**
2. **Actions** → **Run workflow** (primera vez)
3. Espera 2-3 minutos
4. Abre: `https://rensoconese.github.io/remax-titanium-intranet/`

---

**¡Ya está todo configurado!** Solo necesitas activar GitHub Pages desde la interfaz.
