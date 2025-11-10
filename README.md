# RE/MAX Titanium Intranet

**Migración completa** de la intranet de cursos desde WordPress/LearnDash a Astro.

## 📋 Descripción

Este proyecto realiza una **migración total y completa** de la intranet de cursos de RE/MAX Titanium desde WordPress con LearnDash a un sitio web moderno construido con Astro.

### 🎯 Enfoque: Headless CMS con Migración Completa

Este **NO** es un sitio que hace llamadas a WordPress en tiempo real. Es una **migración completa** donde:

- ✅ Todo el contenido se descarga UNA VEZ de WordPress
- ✅ El contenido se guarda localmente en archivos JSON (`src/data/`)
- ✅ El proyecto es **completamente independiente** de WordPress
- ✅ Todo el contenido está **versionado en Git**
- ✅ Build estático 100% (Static Site Generation)
- ✅ Despliegue automático en GitHub Pages
- ✅ Diseño responsivo con Tailwind CSS
- ✅ TypeScript para type safety
- 🔄 Sistema de autenticación (pendiente)
- 🔄 Seguimiento de progreso de usuarios (pendiente)
- 🔄 Gestión de certificados (pendiente)

## 🚀 Inicio Rápido

### Requisitos previos

- Node.js 18+
- npm o pnpm

### Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Configura las variables de entorno (solo necesario para migración):

Copia el archivo `.env.example` a `.env` y configura tus credenciales de WordPress:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
WORDPRESS_API_URL=https://intranet.remax-titanium.com.ar/wp-json
WORDPRESS_USERNAME=tu_usuario
WORDPRESS_PASSWORD=tu_contraseña
```

3. **Migrar el contenido de WordPress:**

```bash
npm run migrate
```

Este comando descarga TODO el contenido de WordPress y lo guarda en `src/data/`. Solo necesitas ejecutarlo una vez, o cuando quieras actualizar el contenido.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321/remax-titanium-intranet/`

## 📦 Migración de Contenido

El contenido de WordPress se descarga y almacena localmente:

```bash
npm run migrate
```

Esto descarga:
- Todos los cursos
- Todas las lecciones
- Todos los tópicos
- Todos los quizzes
- Todos los usuarios
- Todas las imágenes

**Importante:** Después de la migración, el proyecto es **completamente independiente** de WordPress. No necesitas WordPress funcionando para desarrollar o hacer build.

Para más información, consulta [MIGRATION.md](./MIGRATION.md)

## 🌐 Deploy en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

**URL del sitio en producción:**
```
https://rensoconese.github.io/remax-titanium-intranet/
```

Para más información sobre el despliegue, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React/Astro reutilizables
│   ├── layouts/         # Layouts de página
│   │   └── Layout.astro # Layout principal
│   ├── data/            # Datos migrados de WordPress (JSON)
│   ├── lib/             # Utilidades y clientes
│   │   ├── wordpress.ts    # Cliente WordPress API (solo para migración)
│   │   └── local-data.ts   # Cliente de datos locales
│   ├── pages/          # Rutas del sitio
│   │   ├── index.astro          # Lista de cursos
│   │   ├── courses/[id].astro   # Detalle de curso
│   │   ├── lessons/[id].astro   # Vista de lección
│   │   └── topics/[id].astro    # Vista de tópico
│   ├── stores/         # Estado global (Nanostores)
│   ├── types/          # Definiciones TypeScript
│   │   ├── wordpress.ts    # Tipos de WordPress
│   │   └── learndash.ts    # Tipos de LearnDash
│   └── env.d.ts        # Variables de entorno
├── astro.config.mjs    # Configuración de Astro
├── tailwind.config.mjs # Configuración de Tailwind
└── tsconfig.json       # Configuración de TypeScript
```

## 🔌 Arquitectura de Datos

### Datos Locales
El proyecto lee datos de archivos JSON locales en `src/data/`:

- `courses.json` - Todos los cursos
- `lessons.json` - Todas las lecciones
- `topics.json` - Todos los tópicos
- `quizzes.json` - Todos los quizzes
- `users.json` - Todos los usuarios
- `media.json` - Metadatos de imágenes
- `course-structures.json` - Estructura completa de cursos

### Migración desde WordPress
Durante la migración (`npm run migrate`), se usa la WordPress REST API:

#### WordPress Core
- `/wp/v2/posts` - Posts
- `/wp/v2/users` - Usuarios
- `/wp/v2/media` - Media

#### LearnDash
- `/wp/v2/sfwd-courses` - Cursos
- `/wp/v2/sfwd-lessons` - Lecciones
- `/wp/v2/sfwd-topic` - Tópicos
- `/wp/v2/sfwd-quiz` - Quizzes

## 🎨 Tecnologías

- **[Astro](https://astro.build)** - Framework web
- **[React](https://react.dev)** - Componentes interactivos
- **[Tailwind CSS](https://tailwindcss.com)** - Estilos
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Nanostores](https://github.com/nanostores/nanostores)** - Estado global

## 📝 Scripts Disponibles

```bash
npm run migrate      # Migra TODO el contenido de WordPress a archivos locales
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye el proyecto para producción (sitio estático)
npm run preview      # Preview de la build de producción
npm run astro        # Ejecuta comandos de Astro CLI
```

## 🏗️ Arquitectura del Sitio

Este proyecto utiliza **Static Site Generation (SSG)** con datos locales:

### Flujo de Trabajo

1. **Migración** (`npm run migrate`):
   - Se conecta a WordPress UNA VEZ
   - Descarga TODO el contenido
   - Guarda en `src/data/` como JSON
   - ✅ El proyecto queda independiente

2. **Desarrollo** (`npm run dev`):
   - Lee datos de archivos locales
   - Sin llamadas a WordPress
   - Hot reload instantáneo

3. **Build** (`npm run build`):
   - Lee datos de archivos locales
   - Pre-renderiza todas las páginas como HTML estático
   - Sin dependencia de WordPress

4. **Producción** (GitHub Pages):
   - Sirve HTML estático
   - Cero latencia de API
   - Súper rápido

### Actualizar Contenido

Para actualizar el contenido:

```bash
npm run migrate  # Re-migra desde WordPress
git add src/data/
git commit -m "Actualizar contenido"
git push  # Deploy automático en GitHub Pages
```

## 🔐 Autenticación

**Estado: Pendiente de implementación**

El sistema de autenticación se implementará en una fase posterior e incluirá:

- Login/logout de usuarios
- Sesiones persistentes
- Protección de rutas
- Roles y permisos

## 📊 Seguimiento de Progreso

**Estado: Pendiente de implementación**

El sistema de seguimiento incluirá:

- Progreso de cursos por usuario
- Marcado de lecciones completadas
- Historial de actividad
- Certificados al completar cursos

## 🚧 Próximos Pasos

1. ✅ Configurar proyecto base de Astro
2. ✅ Integrar WordPress REST API
3. ✅ Crear páginas de cursos, lecciones y tópicos
4. ⏳ Implementar sistema de autenticación
5. ⏳ Agregar seguimiento de progreso de usuarios
6. ⏳ Implementar sistema de quizzes
7. ⏳ Migrar usuarios desde WordPress
8. ⏳ Implementar búsqueda de cursos
9. ⏳ Agregar filtros y categorías
10. ⏳ Sistema de notificaciones

## 📄 Licencia

Proyecto privado de RE/MAX Titanium.

## 👥 Contacto

Para consultas sobre este proyecto, contacta al equipo de desarrollo de RE/MAX Titanium.
