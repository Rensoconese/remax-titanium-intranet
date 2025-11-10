import type { WPPost } from './wordpress';

// LearnDash Course
export interface LDCourse extends WPPost {
  type: 'sfwd-courses';
  course_price_type: 'open' | 'free' | 'paynow' | 'subscribe' | 'closed';
  course_price: string;
  course_materials: string;
  course_certificate: number;
  course_prerequisite: number[];
  course_points: number;
  course_access_list: number[];
}

// LearnDash Lesson
export interface LDLesson extends WPPost {
  type: 'sfwd-lessons';
  course: number;
  lesson_materials: string;
  lesson_video_enabled: boolean;
  lesson_video_url: string;
  lesson_assignment_upload: boolean;
}

// LearnDash Topic
export interface LDTopic extends WPPost {
  type: 'sfwd-topic';
  course: number;
  lesson: number;
  topic_materials: string;
  topic_video_enabled: boolean;
  topic_video_url: string;
  topic_assignment_upload: boolean;
}

// LearnDash Quiz
export interface LDQuiz extends WPPost {
  type: 'sfwd-quiz';
  course: number;
  lesson: number;
  quiz_materials: string;
  quiz_pass_percentage: number;
  quiz_questions: number[];
}

// LearnDash Question
export interface LDQuestion extends WPPost {
  type: 'sfwd-question';
  quiz: number;
  question_type: 'single' | 'multiple' | 'free_answer' | 'essay' | 'matrix_sort_answer';
  question_answer_points: number;
  answer_data: any[];
}

// User Progress
export interface UserCourseProgress {
  user_id: number;
  course_id: number;
  completed: number;
  total: number;
  status: 'not_started' | 'in_progress' | 'completed';
  last_activity: string;
  completed_on: string | null;
  certificate_id: number | null;
}

export interface UserLessonProgress {
  user_id: number;
  lesson_id: number;
  course_id: number;
  completed: boolean;
  completed_on: string | null;
}

// Course Structure
export interface CourseStructure {
  course: LDCourse;
  lessons: Array<{
    lesson: LDLesson;
    topics: LDTopic[];
    quizzes: LDQuiz[];
  }>;
  course_quizzes: LDQuiz[];
}
