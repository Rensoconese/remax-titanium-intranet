/**
 * Solución TEMPORAL para mostrar lecciones
 * hasta que se haga una migración correcta
 */
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function tempFix() {
  const dataDir = join(process.cwd(), 'src', 'data');

  const courses = JSON.parse(await readFile(join(dataDir, 'courses.json'), 'utf-8'));
  const lessons = JSON.parse(await readFile(join(dataDir, 'lessons.json'), 'utf-8'));
  const topics = JSON.parse(await readFile(join(dataDir, 'topics.json'), 'utf-8'));
  const quizzes = JSON.parse(await readFile(join(dataDir, 'quizzes.json'), 'utf-8'));

  console.log('🔧 Aplicando fix temporal...\n');

  const course = courses[0]; // Solo hay un curso

  // Asignar TODAS las lecciones ordenadas
  const sortedLessons = lessons.sort((a: any, b: any) => 
    (a.menu_order || 0) - (b.menu_order || 0)
  );

  // Distribuir tópicos y quizzes entre las lecciones
  // Como no sabemos la relación exacta, los distribuiremos equitativamente
  const topicsPerLesson = Math.ceil(topics.length / lessons.length);
  const quizzesPerLesson = Math.ceil(quizzes.length / lessons.length);

  const lessonsWithContent = sortedLessons.map((lesson: any, index: number) => {
    const startTopic = index * topicsPerLesson;
    const startQuiz = index * quizzesPerLesson;

    const lessonTopics = topics.slice(startTopic, startTopic + topicsPerLesson);
    const lessonQuizzes = quizzes.slice(startQuiz, startQuiz + quizzesPerLesson);

    console.log(`📖 ${lesson.title.rendered}`);
    console.log(`   ${lessonTopics.length} tópicos, ${lessonQuizzes.length} quizzes`);

    return {
      lesson,
      topics: lessonTopics,
      quizzes: lessonQuizzes,
    };
  });

  const courseStructures = [{
    course,
    lessons: lessonsWithContent,
    course_quizzes: [],
  }];

  await writeFile(
    join(dataDir, 'course-structures.json'),
    JSON.stringify(courseStructures, null, 2)
  );

  console.log(`\n✅ Fix temporal aplicado!`);
  console.log(`📚 ${course.title.rendered}`);
  console.log(`   ${lessonsWithContent.length} lecciones`);
  console.log(`   ${topics.length} tópicos (distribuidos)`);
  console.log(`\n⚠️  NOTA: Esta es una solución TEMPORAL`);
  console.log(`    Los tópicos están distribuidos uniformemente, no según su relación real.`);
  console.log(`    Para una solución correcta, ejecuta: npm run migrate con las credenciales de WordPress`);
}

tempFix();
