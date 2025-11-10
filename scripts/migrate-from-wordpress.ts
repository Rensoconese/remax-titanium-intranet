/**
 * Script de migración completa de WordPress a Astro
 *
 * Este script descarga TODO el contenido de WordPress/LearnDash
 * y lo guarda en archivos JSON locales en src/data/
 *
 * Una vez ejecutado, el proyecto NO necesita conexión a WordPress
 *
 * Uso: npm run migrate
 */

import { config } from 'dotenv';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Cargar variables de entorno del archivo .env
config();

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://intranet.remax-titanium.com.ar/wp-json';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD;

if (!WORDPRESS_USERNAME || !WORDPRESS_PASSWORD) {
  console.error('❌ Error: Debes configurar WORDPRESS_USERNAME y WORDPRESS_PASSWORD en .env');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64')}`;

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${WORDPRESS_API_URL}${endpoint}`;
  console.log(`📡 Fetching: ${endpoint}`);

  const response = await fetch(url, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  let page = 1;
  let allResults: T[] = [];
  let hasMore = true;

  while (hasMore) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${WORDPRESS_API_URL}${endpoint}${separator}per_page=100&page=${page}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        // No more pages
        hasMore = false;
        break;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      allResults = allResults.concat(data);
      console.log(`  📄 Página ${page}: ${data.length} items`);
      page++;
    } else {
      hasMore = false;
    }
  }

  return allResults;
}

async function downloadMedia(mediaIds: number[]) {
  console.log(`📷 Descargando información de ${mediaIds.length} archivos multimedia...`);
  const media = [];

  for (const id of mediaIds) {
    try {
      const mediaData = await fetchAPI(`/wp/v2/media/${id}`);
      media.push(mediaData);
    } catch (error) {
      console.warn(`  ⚠️  No se pudo descargar media ${id}`);
    }
  }

  return media;
}

async function migrateContent() {
  console.log('🚀 Iniciando migración completa de WordPress a Astro...\n');
  console.log('📦 Esto descargará TODO el contenido y lo guardará localmente.\n');

  const dataDir = join(process.cwd(), 'src', 'data');

  try {
    // 1. Descargar todos los cursos
    console.log('📚 Descargando TODOS los cursos...');
    const courses = await fetchAllPages('/wp/v2/sfwd-courses');
    await writeFile(
      join(dataDir, 'courses.json'),
      JSON.stringify(courses, null, 2)
    );
    console.log(`✅ ${courses.length} cursos descargados y guardados\n`);

    // 2. Descargar todas las lecciones
    console.log('📖 Descargando TODAS las lecciones...');
    const lessons = await fetchAllPages('/wp/v2/sfwd-lessons');
    await writeFile(
      join(dataDir, 'lessons.json'),
      JSON.stringify(lessons, null, 2)
    );
    console.log(`✅ ${lessons.length} lecciones descargadas y guardadas\n`);

    // 3. Descargar todos los tópicos
    console.log('📝 Descargando TODOS los tópicos...');
    const topics = await fetchAllPages('/wp/v2/sfwd-topic');
    await writeFile(
      join(dataDir, 'topics.json'),
      JSON.stringify(topics, null, 2)
    );
    console.log(`✅ ${topics.length} tópicos descargados y guardados\n`);

    // 4. Descargar todos los quizzes
    console.log('📋 Descargando TODOS los quizzes...');
    const quizzes = await fetchAllPages('/wp/v2/sfwd-quiz');
    await writeFile(
      join(dataDir, 'quizzes.json'),
      JSON.stringify(quizzes, null, 2)
    );
    console.log(`✅ ${quizzes.length} quizzes descargados y guardados\n`);

    // 5. Descargar todos los usuarios
    console.log('👥 Descargando TODOS los usuarios...');
    const users = await fetchAllPages('/wp/v2/users');
    await writeFile(
      join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ ${users.length} usuarios descargados y guardados\n`);

    // 6. Descargar media de featured images
    console.log('🖼️  Procesando imágenes destacadas...');
    const mediaIds = new Set<number>();

    courses.forEach((course: any) => {
      if (course.featured_media) mediaIds.add(course.featured_media);
    });

    lessons.forEach((lesson: any) => {
      if (lesson.featured_media) mediaIds.add(lesson.featured_media);
    });

    const media = await downloadMedia(Array.from(mediaIds));
    await writeFile(
      join(dataDir, 'media.json'),
      JSON.stringify(media, null, 2)
    );
    console.log(`✅ ${media.length} archivos multimedia descargados\n`);

    // 7. Construir estructura completa de cursos
    console.log('🏗️  Construyendo estructura completa de cursos...');
    const courseStructures = [];

    for (const course of courses as any[]) {
      console.log(`  📚 Procesando: ${course.title?.rendered || course.id}`);

      const courseLessons = (lessons as any[]).filter(l => l.course === course.id);

      const lessonsWithContent = await Promise.all(
        courseLessons.map(async (lesson: any) => {
          const lessonTopics = (topics as any[]).filter(t => t.lesson === lesson.id);
          const lessonQuizzes = (quizzes as any[]).filter(q => q.lesson === lesson.id);

          return {
            lesson,
            topics: lessonTopics,
            quizzes: lessonQuizzes,
          };
        })
      );

      const courseQuizzes = (quizzes as any[]).filter(q => q.course === course.id && !q.lesson);

      courseStructures.push({
        course,
        lessons: lessonsWithContent,
        course_quizzes: courseQuizzes,
      });
    }

    await writeFile(
      join(dataDir, 'course-structures.json'),
      JSON.stringify(courseStructures, null, 2)
    );
    console.log(`✅ ${courseStructures.length} estructuras completas guardadas\n`);

    // 8. Guardar metadatos de la migración
    const metadata = {
      migrated_at: new Date().toISOString(),
      wordpress_url: WORDPRESS_API_URL.replace('/wp-json', ''),
      stats: {
        courses: courses.length,
        lessons: lessons.length,
        topics: topics.length,
        quizzes: quizzes.length,
        users: users.length,
        media: media.length,
      }
    };

    await writeFile(
      join(dataDir, 'migration-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('✨ ¡Migración completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   • ${courses.length} cursos`);
    console.log(`   • ${lessons.length} lecciones`);
    console.log(`   • ${topics.length} tópicos`);
    console.log(`   • ${quizzes.length} quizzes`);
    console.log(`   • ${users.length} usuarios`);
    console.log(`   • ${media.length} archivos multimedia`);
    console.log(`\n📁 Todo guardado en: src/data/`);
    console.log(`\n🎉 El proyecto ahora es completamente independiente de WordPress!`);

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

migrateContent();
