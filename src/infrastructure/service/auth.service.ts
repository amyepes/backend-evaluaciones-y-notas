import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/infrastructure/service/user.service';
import { LoginDto } from 'src/application/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CoreUser } from 'generated/prisma';

type SafeCoreUser = Omit<CoreUser, 'passwordHash'>;
import { JwtService } from '@nestjs/jwt';

export interface IPayloadLogin{
  sub: string
  username: string
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async validateUser(body: LoginDto){
      try {
        const user = await this.userService.findOneUser(body.username);
        if(!user) return null
        const match = await bcrypt.compare(body.password, user.passwordHash ?? "");
        if(match){
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {passwordHash, ...result} = user;
          return result;
        }
        return null;
      
      } catch (error) {
        if(error instanceof Error) throw new InternalServerErrorException(error.message)
      }
  }

  async login(user: SafeCoreUser){
    const payload: IPayloadLogin = {username: user.username, sub: user.id}
    const token = await this.jwtService.signAsync(payload);
    return {
      user,
      access_token: token
    }
  }
}
