import { useState } from 'react';

interface CourseProgressProps {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
}

export default function CourseProgress({
  courseId,
  totalLessons,
  completedLessons
}: CourseProgressProps) {
  const percentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">
          Progreso del curso
        </h3>
        <span className="text-2xl font-bold text-primary-600">
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">
        {completedLessons} de {totalLessons} lecciones completadas
      </p>

      {percentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 ¡Felicitaciones! Has completado este curso
          </p>
        </div>
      )}
    </div>
  );
}
