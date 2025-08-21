export class UserEntity {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: string;
  createdAt: Date;
  //studentSubject?: Array<{ subjectId: number; studentId: number }>;
}
