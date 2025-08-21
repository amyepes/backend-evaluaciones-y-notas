import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [AuthModule, UserModule, SubjectModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
