
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SECRET_KEY } from 'src/core/constant/env.constant';
import { IPayloadLogin } from 'src/infrastructure/service/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(SECRET_KEY),
    });
  }

   validate(payload: IPayloadLogin) {
    return { userId: payload.sub, username: payload.username };
  }
}
