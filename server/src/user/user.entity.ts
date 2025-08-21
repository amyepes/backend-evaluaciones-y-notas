
import { Role } from '@prisma/client';

export class UserEntity {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: Role;
  createdAt: Date;
  
  // Optional relations
  studentSubject?: any[];
  califications?: any[];
  subjects?: any[];
}
