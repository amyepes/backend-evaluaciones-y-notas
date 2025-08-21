import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/service/prisma.service';
import { CoreUser } from 'generated/prisma';

type SafeCoreUser = Omit<CoreUser, 'passwordHash'>;
import { CreateUserDto } from 'src/application/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneUser(username: string): Promise<CoreUser | null> {
    try {
      const user = await this.prisma.coreUser.findUnique({
        where: {
          username,
        },
      });
      return user ? user : null;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async createUser(body: CreateUserDto): Promise<SafeCoreUser | undefined> {
    try {
      const validation = await this.prisma.coreUser.findFirst({
        where: {
          username: body.username,
        },
      });
      if (validation) throw new BadRequestException('Este usuario ya está en uso');
      //..
      const salt = await bcrypt.genSalt()
      const hash = await bcrypt.hash(body.password, salt)
      const newUser = await this.prisma.coreUser.create({
        data: {
          username: body.username,
          email: body.email,
          passwordHash: hash,
          userType: body.userType,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = newUser;
      return result;
    } catch (error) {
      if(error instanceof BadRequestException)
        throw new BadRequestException(error.message)
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(userId: string): Promise<SafeCoreUser | undefined> {
    try {
      const user = await this.prisma.coreUser.findUnique({
        where: {
          id: userId,
        },
        include: {
          profile: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
      if (!user) throw new NotFoundException('User not found');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {passwordHash, ...result} = user
      return result
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
