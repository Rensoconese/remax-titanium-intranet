# RE/MAX Titanium Intranet

Migración de la intranet de cursos desde WordPress/LearnDash a Astro.

## 📋 Descripción

Este proyecto es una migración completa de la intranet de cursos de RE/MAX Titanium desde WordPress con LearnDash a un sitio web moderno construido con Astro. El proyecto incluye:

- ✅ Integración con WordPress REST API para extraer contenido
- ✅ Integración con LearnDash API para cursos, lecciones y tópicos
- ✅ Sistema de rutas dinámicas para cursos, lecciones y tópicos
- ✅ Diseño responsivo con Tailwind CSS
- ✅ TypeScript para type safety
- ✅ Server-side rendering con Astro
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

2. Configura las variables de entorno:

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

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📁 Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React/Astro reutilizables
│   ├── layouts/         # Layouts de página
│   │   └── Layout.astro # Layout principal
│   ├── lib/            # Utilidades y clientes API
│   │   └── wordpress.ts # Cliente WordPress/LearnDash API
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

## 🔌 API de WordPress

El proyecto se conecta a la API REST de WordPress y utiliza los siguientes endpoints:

### WordPress Core
- `/wp/v2/posts` - Posts
- `/wp/v2/users` - Usuarios
- `/wp/v2/media` - Media

### LearnDash
- `/wp/v2/sfwd-courses` - Cursos
- `/wp/v2/sfwd-lessons` - Lecciones
- `/wp/v2/sfwd-topic` - Tópicos
- `/wp/v2/sfwd-quiz` - Quizzes
- `/ldlms/v2/users/{id}/courses/{id}/progress` - Progreso del usuario

## 🎨 Tecnologías

- **[Astro](https://astro.build)** - Framework web
- **[React](https://react.dev)** - Componentes interactivos
- **[Tailwind CSS](https://tailwindcss.com)** - Estilos
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Nanostores](https://github.com/nanostores/nanostores)** - Estado global

## 📝 Scripts Disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Construye el proyecto para producción
npm run preview   # Preview de la build de producción
npm run astro     # Ejecuta comandos de Astro CLI
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
