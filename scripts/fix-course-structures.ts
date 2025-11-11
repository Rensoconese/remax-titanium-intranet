/**
 * Script para corregir las estructuras de cursos
 * usando los datos locales ya migrados
 *
 * Este script lee los JSON existentes y reconstruye
 * las relaciones entre cursos, lecciones, y tópicos
 *
 * Uso: npx tsx scripts/fix-course-structures.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixCourseStructures() {
  console.log('🔧 Corrigiendo estructuras de cursos...\n');

  const dataDir = join(process.cwd(), 'src', 'data');

  try {
    // Leer datos existentes
    const courses = JSON.parse(await readFile(join(dataDir, 'courses.json'), 'utf-8'));
    const lessons = JSON.parse(await readFile(join(dataDir, 'lessons.json'), 'utf-8'));
    const topics = JSON.parse(await readFile(join(dataDir, 'topics.json'), 'utf-8'));
    const quizzes = JSON.parse(await readFile(join(dataDir, 'quizzes.json'), 'utf-8'));

    console.log(`📚 ${courses.length} cursos`);
    console.log(`📖 ${lessons.length} lecciones`);
    console.log(`📝 ${topics.length} tópicos`);
    console.log(`📋 ${quizzes.length} quizzes\n`);

    // En LearnDash, las lecciones tienen el curso en los metadatos
    // Verificar estructura de lecciones
    console.log('🔍 Analizando estructura de datos...');

    if (lessons.length > 0) {
      const sampleLesson = lessons[0];
      console.log(`   Campos de lección de ejemplo:`, Object.keys(sampleLesson).slice(0, 10));
    }

    if (topics.length > 0) {
      const sampleTopic = topics[0];
      console.log(`   Campos de tópico de ejemplo:`, Object.keys(sampleTopic).slice(0, 10));
    }

    // Construir estructura basada en menu_order y jerarquía
    // En LearnDash, las lecciones y tópicos se ordenan por menu_order
    const courseStructures = [];

    for (const course of courses) {
      console.log(`\n📚 Procesando: ${course.title?.rendered || course.id}`);

      // Todas las lecciones (sin filtro por ahora, ya que no hay campo course en el JSON)
      // Las agregaremos todas al único curso disponible
      const courseLessons = lessons.sort((a: any, b: any) => (a.menu_order || 0) - (b.menu_order || 0));

      const lessonsWithContent = courseLessons.map((lesson: any) => {
        // Buscar tópicos que pertenezcan a esta lección
        // Los tópicos también deberían tener alguna referencia
        const lessonTopics = topics
          .filter((t: any) => {
            // Intentar encontrar relación en el link o slug
            const topicLink = t.link || '';
            const lessonSlug = lesson.slug || '';
            // Esta es una heurística - podría necesitar ajuste
            return topicLink.includes(`clases/${lessonSlug}/`);
          })
          .sort((a: any, b: any) => (a.menu_order || 0) - (b.menu_order || 0));

        const lessonQuizzes = quizzes
          .filter((q: any) => {
            const quizLink = q.link || '';
            const lessonSlug = lesson.slug || '';
            return quizLink.includes(`clases/${lessonSlug}/`);
          })
          .sort((a: any, b: any) => (a.menu_order || 0) - (b.menu_order || 0));

        console.log(`   📖 ${lesson.title?.rendered}: ${lessonTopics.length} tópicos, ${lessonQuizzes.length} quizzes`);

        return {
          lesson,
          topics: lessonTopics,
          quizzes: lessonQuizzes,
        };
      });

      // Quizzes del curso (no asociados a lecciones específicas)
      const courseQuizzes = quizzes
        .filter((q: any) => {
          const quizLink = q.link || '';
          return quizLink.includes(`/cursos/${course.slug}/`) && !quizLink.includes('/clases/');
        })
        .sort((a: any, b: any) => (a.menu_order || 0) - (b.menu_order || 0));

      courseStructures.push({
        course,
        lessons: lessonsWithContent,
        course_quizzes: courseQuizzes,
      });

      console.log(`   ✅ ${lessonsWithContent.length} lecciones procesadas`);
    }

    // Guardar estructuras corregidas
    await writeFile(
      join(dataDir, 'course-structures.json'),
      JSON.stringify(courseStructures, null, 2)
    );

    console.log(`\n✅ Estructuras de cursos corregidas y guardadas`);
    console.log(`\n📊 Resumen:`);
    courseStructures.forEach((cs: any) => {
      console.log(`   • ${cs.course.title.rendered}: ${cs.lessons.length} lecciones`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

fixCourseStructures();
