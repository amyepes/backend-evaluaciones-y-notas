import { Module } from '@nestjs/common';
import { AppService } from 'src/infrastructure/service/app.service';
import { AuthService } from 'src/infrastructure/service/auth.service';
import { UserService } from 'src/infrastructure/service/user.service';
import { PrismaService } from 'src/infrastructure/service/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RepositoryModule } from 'src/infrastructure/module/repository.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SECRET_KEY } from 'src/core/constant/env.constant';
import { LocalStrategy } from 'src/core/strategy/local.strategy';
import { JwtStrategy } from 'src/core/strategy/jwt.strategy';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60,
      max: 1000
    }),
    RepositoryModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(SECRET_KEY),
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [
    PrismaService,
    AppService,
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy
  ],
  exports: [
    PrismaService,
    AppService,
    AuthService,
    UserService
  ]
})
export class ServiceModule {}
