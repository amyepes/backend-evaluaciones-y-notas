import { apiClient } from "@/config/axios-config";

export interface Quiz {
  id: number;
  name: string;
  createdAt: string;
  subjectId: number;
  subject: {
    id: number;
    name: string;
    professor: {
      id: number;
      name: string;
    };
  };
  _count: {
    califications: number;
  };
}

export interface QuizzesResponse {
  quizzes: Quiz[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface QuizQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  subjectId?: string;
}

class QuizService {
  async getAllQuizzes(params: QuizQueryParams = {}): Promise<QuizzesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await apiClient.get(`/admin/quizzes?${queryParams.toString()}`);
    return response.data;
  }

  async getQuizById(id: number): Promise<Quiz> {
    const response = await apiClient.get(`/admin/quizzes/${id}`);
    return response.data;
  }

  async createQuiz(quizData: { name: string; subjectId: number }): Promise<Quiz> {
    const response = await apiClient.post("/admin/quizzes", quizData);
    return response.data;
  }

  async updateQuiz(id: number, quizData: { name?: string; subjectId?: number }): Promise<Quiz> {
    const response = await apiClient.put(`/admin/quizzes/${id}`, quizData);
    return response.data;
  }

  async deleteQuiz(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/quizzes/${id}`);
    return response.data;
  }

  async getQuizzesBySubject(subjectId: number) {
    const response = await apiClient.get(`/admin/quizzes/subject/${subjectId}`);
    return response.data;
  }
}

export const quizService = new QuizService();
