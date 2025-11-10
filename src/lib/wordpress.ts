import type { WPPost, WPUser, WPMedia } from '@/types/wordpress';
import type { LDCourse, LDLesson, LDTopic, LDQuiz, CourseStructure } from '@/types/learndash';

const WORDPRESS_API_URL = import.meta.env.WORDPRESS_API_URL;
const WORDPRESS_USERNAME = import.meta.env.WORDPRESS_USERNAME;
const WORDPRESS_PASSWORD = import.meta.env.WORDPRESS_PASSWORD;

class WordPressClient {
  private baseUrl: string;
  private authHeader: string;

  constructor() {
    this.baseUrl = WORDPRESS_API_URL;
    const credentials = btoa(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`);
    this.authHeader = `Basic ${credentials}`;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Generic post fetching
  async getPosts(postType: string, params: Record<string, any> = {}): Promise<WPPost[]> {
    const queryParams = new URLSearchParams({
      per_page: '100',
      ...params,
    });
    return this.fetch<WPPost[]>(`/wp/v2/${postType}?${queryParams}`);
  }

  async getPost(postType: string, id: number): Promise<WPPost> {
    return this.fetch<WPPost>(`/wp/v2/${postType}/${id}`);
  }

  // LearnDash specific methods
  async getCourses(): Promise<LDCourse[]> {
    return this.fetch<LDCourse[]>('/wp/v2/sfwd-courses?per_page=100');
  }

  async getCourse(id: number): Promise<LDCourse> {
    return this.fetch<LDCourse>(`/wp/v2/sfwd-courses/${id}`);
  }

  async getLessons(courseId?: number): Promise<LDLesson[]> {
    const params = courseId ? `?course=${courseId}` : '';
    return this.fetch<LDLesson[]>(`/wp/v2/sfwd-lessons${params}&per_page=100`);
  }

  async getTopics(lessonId?: number): Promise<LDTopic[]> {
    const params = lessonId ? `?lesson=${lessonId}` : '';
    return this.fetch<LDTopic[]>(`/wp/v2/sfwd-topic${params}&per_page=100`);
  }

  async getQuizzes(courseId?: number): Promise<LDQuiz[]> {
    const params = courseId ? `?course=${courseId}` : '';
    return this.fetch<LDQuiz[]>(`/wp/v2/sfwd-quiz${params}&per_page=100`);
  }

  async getCourseStructure(courseId: number): Promise<CourseStructure> {
    const course = await this.getCourse(courseId);
    const lessons = await this.getLessons(courseId);
    const course_quizzes = await this.getQuizzes(courseId);

    const lessonsWithContent = await Promise.all(
      lessons.map(async (lesson) => {
        const topics = await this.getTopics(lesson.id);
        const quizzes = course_quizzes.filter(quiz => quiz.lesson === lesson.id);
        return {
          lesson,
          topics,
          quizzes,
        };
      })
    );

    return {
      course,
      lessons: lessonsWithContent,
      course_quizzes: course_quizzes.filter(quiz => !quiz.lesson),
    };
  }

  // Users
  async getUsers(): Promise<WPUser[]> {
    return this.fetch<WPUser[]>('/wp/v2/users?per_page=100');
  }

  async getUser(id: number): Promise<WPUser> {
    return this.fetch<WPUser>(`/wp/v2/users/${id}`);
  }

  // Media
  async getMedia(id: number): Promise<WPMedia> {
    return this.fetch<WPMedia>(`/wp/v2/media/${id}`);
  }

  // User progress (requires LearnDash API endpoints)
  async getUserCourseProgress(userId: number, courseId: number): Promise<any> {
    try {
      return this.fetch(`/ldlms/v2/users/${userId}/courses/${courseId}/progress`);
    } catch (error) {
      console.error('Error fetching user course progress:', error);
      return null;
    }
  }
}

export const wordpress = new WordPressClient();
