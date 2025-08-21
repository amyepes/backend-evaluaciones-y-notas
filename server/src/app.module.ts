import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { QuizModule } from './quiz/quiz.module';
import { StudentModule } from './student/student.module';
import { CalificationModule } from './calification/calification.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [AuthModule, UserModule, SubjectModule, QuizModule, StudentModule, CalificationModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
