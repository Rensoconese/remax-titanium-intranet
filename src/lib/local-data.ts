import type { WPPost, WPMedia } from '@/types/wordpress';
import type { CourseStructure } from '@/types/learndash';

// Importar datos locales
import coursesData from '@/data/courses.json';
import lessonsData from '@/data/lessons.json';
import topicsData from '@/data/topics.json';
import quizzesData from '@/data/quizzes.json';
import usersData from '@/data/users.json';
import mediaData from '@/data/media.json';
import courseStructuresData from '@/data/course-structures.json';

/**
 * Cliente local de datos
 *
 * Lee datos de archivos JSON locales en lugar de hacer llamadas a la API de WordPress.
 * Todo el contenido fue descargado durante la migración.
 */
class LocalDataClient {
  // Get all courses
  async getCourses(): Promise<any[]> {
    return coursesData as any[];
  }

  // Get single course
  async getCourse(id: number): Promise<any> {
    const course = (coursesData as any[]).find(c => c.id === id);
    if (!course) {
      throw new Error(`Course ${id} not found`);
    }
    return course;
  }

  // Get all lessons, optionally filtered by course
  async getLessons(courseId?: number): Promise<any[]> {
    const lessons = lessonsData as any[];
    if (courseId) {
      return lessons.filter(l => l.course === courseId);
    }
    return lessons;
  }

  // Get single lesson
  async getLesson(id: number): Promise<any> {
    const lesson = (lessonsData as any[]).find(l => l.id === id);
    if (!lesson) {
      throw new Error(`Lesson ${id} not found`);
    }
    return lesson;
  }

  // Get all topics, optionally filtered by lesson
  async getTopics(lessonId?: number): Promise<any[]> {
    const topics = topicsData as any[];
    if (lessonId) {
      return topics.filter(t => t.lesson === lessonId);
    }
    return topics;
  }

  // Get single topic
  async getTopic(id: number): Promise<any> {
    const topic = (topicsData as any[]).find(t => t.id === id);
    if (!topic) {
      throw new Error(`Topic ${id} not found`);
    }
    return topic;
  }

  // Get all quizzes, optionally filtered by course
  async getQuizzes(courseId?: number): Promise<any[]> {
    const quizzes = quizzesData as any[];
    if (courseId) {
      return quizzes.filter(q => q.course === courseId);
    }
    return quizzes;
  }

  // Get single quiz
  async getQuiz(id: number): Promise<any> {
    const quiz = (quizzesData as any[]).find(q => q.id === id);
    if (!quiz) {
      throw new Error(`Quiz ${id} not found`);
    }
    return quiz;
  }

  // Get course structure with all related content
  async getCourseStructure(courseId: number): Promise<any> {
    const structure = (courseStructuresData as any[]).find(
      cs => cs.course.id === courseId
    );

    if (!structure) {
      throw new Error(`Course structure ${courseId} not found`);
    }

    return structure;
  }

  // Get all users
  async getUsers(): Promise<any[]> {
    return usersData as any[];
  }

  // Get single user
  async getUser(id: number): Promise<any> {
    const user = (usersData as any[]).find(u => u.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return user;
  }

  // Get media
  async getMedia(id: number): Promise<WPMedia> {
    const media = (mediaData as WPMedia[]).find(m => m.id === id);
    if (!media) {
      throw new Error(`Media ${id} not found`);
    }
    return media;
  }

  // Generic post getter (for compatibility)
  async getPost(postType: string, id: number): Promise<WPPost> {
    switch (postType) {
      case 'sfwd-courses':
        return this.getCourse(id);
      case 'sfwd-lessons':
        return this.getLesson(id);
      case 'sfwd-topic':
        return this.getTopic(id);
      case 'sfwd-quiz':
        return this.getQuiz(id);
      default:
        throw new Error(`Unknown post type: ${postType}`);
    }
  }

  // Get all posts by type (for compatibility)
  async getPosts(postType: string, params: Record<string, any> = {}): Promise<WPPost[]> {
    switch (postType) {
      case 'sfwd-courses':
        return this.getCourses();
      case 'sfwd-lessons':
        return this.getLessons(params.course);
      case 'sfwd-topic':
        return this.getTopics(params.lesson);
      case 'sfwd-quiz':
        return this.getQuizzes(params.course);
      default:
        throw new Error(`Unknown post type: ${postType}`);
    }
  }
}

// Export singleton instance
export const localData = new LocalDataClient();

// For backwards compatibility, also export as wordpress
export const wordpress = localData;
