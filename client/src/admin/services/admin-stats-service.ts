import { apiClient } from "@/config/axios-config";

export interface SystemStats {
  overview: {
    totalUsers: number;
    totalSubjects: number;
    totalQuizzes: number;
    totalCalifications: number;
    totalStudentEnrollments: number;
  };
  userStats: {
    byRole: {
      admin: number;
      professor: number;
      student: number;
    };
  };
  academicStats: {
    avgStudentsPerSubject: number;
    avgQuizzesPerSubject: number;
    passRate: number;
    averageGrade: number;
    minGrade: number;
    maxGrade: number;
  };
  recentActivity: {
    newUsers: number;
    newSubjects: number;
    newQuizzes: number;
  };
  topSubjects: Array<{
    id: number;
    name: string;
    professor: {
      id: number;
      name: string;
    };
    studentsCount: number;
    quizzesCount: number;
  }>;
}

export interface MonthlyStats {
  currentMonth: {
    users: number;
    subjects: number;
    quizzes: number;
    enrollments: number;
  };
  lastMonth: {
    users: number;
    subjects: number;
    quizzes: number;
    enrollments: number;
  };
  growth: {
    users: number;
    subjects: number;
    quizzes: number;
    enrollments: number;
  };
}

class AdminStatsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get("/admin/stats/system", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getMonthlyStats(): Promise<MonthlyStats> {
    const response = await apiClient.get("/admin/stats/monthly", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const adminStatsService = new AdminStatsService();
