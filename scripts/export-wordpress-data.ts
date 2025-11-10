/**
 * Script para exportar todo el contenido de WordPress/LearnDash a archivos JSON
 *
 * Uso: npm run export-data
 *
 * Este script extrae:
 * - Todos los cursos con su estructura completa
 * - Todas las lecciones y tópicos
 * - Todos los quizzes y preguntas
 * - Todos los usuarios
 * - Metadatos de progreso de usuarios
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

async function exportData() {
  console.log('🚀 Iniciando exportación de datos de WordPress...\n');

  const dataDir = join(process.cwd(), 'data');

  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  try {
    // Export courses
    console.log('📚 Exportando cursos...');
    const courses = await fetchAPI('/wp/v2/sfwd-courses?per_page=100');
    await writeFile(
      join(dataDir, 'courses.json'),
      JSON.stringify(courses, null, 2)
    );
    console.log(`✅ ${Array.isArray(courses) ? courses.length : 0} cursos exportados\n`);

    // Export lessons
    console.log('📖 Exportando lecciones...');
    const lessons = await fetchAPI('/wp/v2/sfwd-lessons?per_page=100');
    await writeFile(
      join(dataDir, 'lessons.json'),
      JSON.stringify(lessons, null, 2)
    );
    console.log(`✅ ${Array.isArray(lessons) ? lessons.length : 0} lecciones exportadas\n`);

    // Export topics
    console.log('📝 Exportando tópicos...');
    const topics = await fetchAPI('/wp/v2/sfwd-topic?per_page=100');
    await writeFile(
      join(dataDir, 'topics.json'),
      JSON.stringify(topics, null, 2)
    );
    console.log(`✅ ${Array.isArray(topics) ? topics.length : 0} tópicos exportados\n`);

    // Export quizzes
    console.log('📋 Exportando quizzes...');
    const quizzes = await fetchAPI('/wp/v2/sfwd-quiz?per_page=100');
    await writeFile(
      join(dataDir, 'quizzes.json'),
      JSON.stringify(quizzes, null, 2)
    );
    console.log(`✅ ${Array.isArray(quizzes) ? quizzes.length : 0} quizzes exportados\n`);

    // Export users
    console.log('👥 Exportando usuarios...');
    const users = await fetchAPI('/wp/v2/users?per_page=100');
    await writeFile(
      join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ ${Array.isArray(users) ? users.length : 0} usuarios exportados\n`);

    // Export detailed course structures
    console.log('🏗️ Exportando estructura completa de cursos...');
    if (Array.isArray(courses)) {
      const courseStructures = [];

      for (const course of courses) {
        console.log(`  📚 Procesando: ${course.title?.rendered || course.id}`);

        const courseLessons = Array.isArray(lessons)
          ? lessons.filter((l: any) => l.course === course.id)
          : [];

        const lessonsWithContent = await Promise.all(
          courseLessons.map(async (lesson: any) => {
            const lessonTopics = Array.isArray(topics)
              ? topics.filter((t: any) => t.lesson === lesson.id)
              : [];

            const lessonQuizzes = Array.isArray(quizzes)
              ? quizzes.filter((q: any) => q.lesson === lesson.id)
              : [];

            return {
              lesson,
              topics: lessonTopics,
              quizzes: lessonQuizzes,
            };
          })
        );

        const courseQuizzes = Array.isArray(quizzes)
          ? quizzes.filter((q: any) => q.course === course.id && !q.lesson)
          : [];

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
      console.log(`✅ ${courseStructures.length} estructuras de curso exportadas\n`);
    }

    console.log('✨ ¡Exportación completada exitosamente!');
    console.log(`📁 Datos guardados en: ${dataDir}`);

  } catch (error) {
    console.error('❌ Error durante la exportación:', error);
    process.exit(1);
  }
}

exportData();
