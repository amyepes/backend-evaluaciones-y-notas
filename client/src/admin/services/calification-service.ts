import { apiClient } from "@/config/axios-config";

export interface Calification {
  id: number;
  grade: number;
  createdAt: string;
  studentId: number;
  quizId: number;
  student: {
    id: number;
    name: string;
    username: string;
  };
  quiz: {
    id: number;
    name: string;
    subject: {
      id: number;
      name: string;
      professor: {
        id: number;
        name: string;
      };
    };
  };
}

export interface CalificationsResponse {
  califications: Calification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface CalificationQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  studentId?: string;
  quizId?: string;
  subjectId?: string;
}

export interface CalificationStats {
  totalCalifications: number;
  averageGrade: number;
  passedGrades: number;
  failedGrades: number;
  passRate: number;
  gradeDistribution: Array<{
    grade: number;
    _count: {
      grade: number;
    };
  }>;
}

class CalificationService {
  async getAllCalifications(params: CalificationQueryParams = {}): Promise<CalificationsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await apiClient.get(`/admin/califications?${queryParams.toString()}`);
    return response.data;
  }

  async getCalificationById(id: number): Promise<Calification> {
    const response = await apiClient.get(`/admin/califications/${id}`);
    return response.data;
  }

  async createCalification(calificationData: { studentId: number; quizId: number; grade: number }): Promise<Calification> {
    const response = await apiClient.post("/admin/califications", calificationData);
    return response.data;
  }

  async updateCalification(id: number, calificationData: { grade?: number }): Promise<Calification> {
    const response = await apiClient.put(`/admin/califications/${id}`, calificationData);
    return response.data;
  }

  async deleteCalification(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/califications/${id}`);
    return response.data;
  }

  async getCalificationStats(): Promise<CalificationStats> {
    const response = await apiClient.get("/admin/califications/stats/overview");
    return response.data;
  }

  async getCalificationsByQuiz(quizId: number) {
    const response = await apiClient.get(`/admin/califications/quiz/${quizId}`);
    return response.data;
  }
}

export const calificationService = new CalificationService();
