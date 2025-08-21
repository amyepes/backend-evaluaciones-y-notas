import { apiClient } from "@/config/axios-config";

export interface StudentSubject {
  enrollmentId: number;
  enrolledAt: string;
  subject: {
    id: number;
    name: string;
    professorId: number;
    createdAt: string;
    professor: {
      id: number;
      name: string;
      username: string;
    };
    _count: {
      quizzes: number;
      studentSubject: number;
    };
  };
}

export interface SubjectQuiz {
  id: number;
  name: string;
  createdAt: string;
  grade: number | null;
  hasGrade: boolean;
}

export interface SubjectQuizzesResponse {
  subject: {
    id: number;
    name: string;
    professorId: number;
    createdAt: string;
    professor: {
      id: number;
      name: string;
      username: string;
    };
  };
  quizzes: SubjectQuiz[];
  stats: {
    totalQuizzes: number;
    gradedQuizzes: number;
    pendingQuizzes: number;
    averageGrade: number | null;
  };
}

export interface StudentGrade {
  id: number;
  grade: number;
  quiz: {
    id: number;
    name: string;
  };
}

export interface SubjectGrades {
  subject: {
    id: number;
    name: string;
    professor: {
      id: number;
      name: string;
    };
  };
  grades: StudentGrade[];
  totalGrades: number;
  averageGrade: number;
}

export interface StudentGradesResponse {
  gradesBySubject: SubjectGrades[];
  totalGrades: number;
  overallAverage: number;
}

export interface StudentSubjectsResponse {
  subjects: StudentSubject[];
  totalSubjects: number;
}

class StudentService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getMySubjects(): Promise<StudentSubjectsResponse> {
    const response = await apiClient.get("/student/my-subjects", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getSubjectQuizzes(subjectId: number): Promise<SubjectQuizzesResponse> {
    const response = await apiClient.get(`/student/subject/${subjectId}/quizzes`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getMyGrades(): Promise<StudentGradesResponse> {
    const response = await apiClient.get("/student/my-grades", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getSubjectStats(subjectId: number) {
    const response = await apiClient.get(`/student/subject/${subjectId}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const studentService = new StudentService();
