import { apiClient } from "@/config/axios-config";

export interface Subject {
  id: number;
  name: string;
  professorId: number;
  createdAt: string;
  professor?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
  _count?: {
    studentSubject: number;
    quizzes: number;
  };
}

export interface CreateSubjectDto {
  name: string;
  professorId: number;
}

export interface UpdateSubjectDto {
  name?: string;
  professorId?: number;
}

export interface SubjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  professorId?: number;
}

export interface SubjectsResponse {
  subjects: Subject[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SubjectStats {
  total: number;
  totalStudentAssignments: number;
  totalQuizzes: number;
  avgStudentsPerSubject: number;
  avgQuizzesPerSubject: number;
  subjectsByProfessor: number;
}

export interface StudentAssignment {
  id: number;
  studentId: number;
  subjectId: number;
  createdAt: string;
  student: {
    id: number;
    name: string;
    username: string;
  };
  subject: {
    id: number;
    name: string;
  };
}

class SubjectService {
  async getAllSubjects(params: SubjectQueryParams = {}): Promise<SubjectsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.professorId) queryParams.append('professorId', params.professorId.toString());

    const response = await apiClient.get(`/admin/subjects?${queryParams.toString()}`);
    return response.data;
  }

  async getSubjectById(id: number): Promise<Subject> {
    const response = await apiClient.get(`/admin/subjects/${id}`);
    return response.data;
  }

  async createSubject(subjectData: CreateSubjectDto): Promise<Subject> {
    const response = await apiClient.post("/admin/subjects", subjectData);
    return response.data;
  }

  async updateSubject(id: number, subjectData: UpdateSubjectDto): Promise<Subject> {
    const response = await apiClient.put(`/admin/subjects/${id}`, subjectData);
    return response.data;
  }

  async deleteSubject(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/subjects/${id}`);
    return response.data;
  }

  async getSubjectStats(): Promise<SubjectStats> {
    const response = await apiClient.get("/admin/subjects/stats/overview");
    return response.data;
  }

  async getSubjectsByProfessor(professorId: number) {
    const response = await apiClient.get(`/admin/subjects/professor/${professorId}`);
    return response.data;
  }

  async getSubjectStudents(subjectId: number) {
    const response = await apiClient.get(`/admin/subjects/${subjectId}/students`);
    return response.data;
  }

  async assignStudentToSubject(subjectId: number, studentId: number): Promise<StudentAssignment> {
    const response = await apiClient.post(`/admin/subjects/${subjectId}/students/${studentId}`, {});
    return response.data;
  }

  async removeStudentFromSubject(subjectId: number, studentId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/subjects/${subjectId}/students/${studentId}`);
    return response.data;
  }

  async searchSubjects(searchTerm: string, limit: number = 10): Promise<Subject[]> {
    const response = await apiClient.get(`/admin/subjects/search/${searchTerm}?limit=${limit}`);
    return response.data;
  }
}

export const subjectService = new SubjectService();
