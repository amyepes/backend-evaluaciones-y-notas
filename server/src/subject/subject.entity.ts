import { Role } from '@prisma/client';

export class SubjectEntity {
  id: number;
  name: string;
  professorId: number;
  createdAt: Date;
  
  // Optional relations
  professor?: {
    id: number;
    name: string;
    username: string;
    role: Role;
  };
  studentSubject?: Array<{
    id: number;
    studentId: number;
    student: {
      id: number;
      name: string;
      username: string;
    };
    createdAt: Date;
  }>;
  quizzes?: Array<{
    id: number;
    name: string;
    createdAt: Date;
  }>;
  _count?: {
    studentSubject: number;
    quizzes: number;
  };
}
