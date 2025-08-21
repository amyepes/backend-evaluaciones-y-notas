export interface SubjectEntity {
  id: number;
  name: string;
  professorId: number;
  createdAt: Date;
  professor?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
  studentSubject?: Array<{
    id: number;
    studentId: number;
    student: {
      id: number;
      name: string;
      username: string;
    };
  }>;
  quizzes?: Array<{
    id: number;
    name: string;
  }>;
  _count?: {
    studentSubject: number;
    quizzes: number;
  };
}
