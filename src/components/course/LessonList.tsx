import type { LDLesson, LDTopic } from '@/types/learndash';

interface LessonListProps {
  lessons: Array<{
    lesson: LDLesson;
    topics: LDTopic[];
    quizzes: any[];
  }>;
  completedLessons?: number[];
}

export default function LessonList({ lessons, completedLessons = [] }: LessonListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {lessons.map((lessonItem, index) => {
        const isCompleted = completedLessons.includes(lessonItem.lesson.id);

        return (
          <div key={lessonItem.lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                ${isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary-100 text-primary-700'}
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>

              <div className="ml-4 flex-1">
                <a
                  href={`/lessons/${lessonItem.lesson.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {lessonItem.lesson.title.rendered}
                </a>

                {lessonItem.lesson.excerpt.rendered && (
                  <div
                    className="text-sm text-gray-600 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: lessonItem.lesson.excerpt.rendered
                    }}
                  />
                )}

                <div className="mt-3 flex items-center gap-4 text-sm">
                  {lessonItem.lesson.lesson_video_enabled && (
                    <span className="flex items-center text-purple-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      Video
                    </span>
                  )}

                  {lessonItem.topics.length > 0 && (
                    <span className="text-gray-600">
                      {lessonItem.topics.length} tópico{lessonItem.topics.length > 1 ? 's' : ''}
                    </span>
                  )}

                  {lessonItem.quizzes.length > 0 && (
                    <span className="flex items-center text-purple-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      {lessonItem.quizzes.length} Quiz
                    </span>
                  )}

                  {isCompleted && (
                    <span className="text-green-600 font-medium">
                      ✓ Completada
                    </span>
                  )}
                </div>

                {/* Topics */}
                {lessonItem.topics.length > 0 && (
                  <div className="mt-3 ml-4 space-y-1">
                    {lessonItem.topics.map((topic) => (
                      <a
                        key={topic.id}
                        href={`/topics/${topic.id}`}
                        className="block text-sm text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        → {topic.title.rendered}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
