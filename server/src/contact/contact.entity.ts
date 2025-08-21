import { UserEntity } from 'src/user/user.entity';

export class ContactEntity {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  userId: number;
  user?: UserEntity;
  createdAt: Date;
}
