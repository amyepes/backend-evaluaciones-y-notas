export class QuizEntity {
  id: number;
  name: string;
  subjectId: number;
  createdAt: Date;
  
  // Optional relations
  subject?: {
    id: number;
    name: string;
    professor?: {
      id: number;
      name: string;
      username?: string;
    };
  };
  califications?: Array<{
    id: number;
    grade: number;
    studentId: number;
    student?: {
      id: number;
      name: string;
      username: string;
    };
  }>;
  _count?: {
    califications: number;
  };
}
