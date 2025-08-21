import { ContactEntity } from "src/contact/contact.entity";

export class UserEntity {
  id: number;
  name: string;
  username: string;
  password?: string;
  createdAt: Date;
  contacts?: ContactEntity[];
}
