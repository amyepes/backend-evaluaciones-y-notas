import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { UserValidationMiddleware } from './user/middleware/user-validation.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SubjectModule,
    QuizModule,
    StudentModule,
    CalificationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicamos el middleware de validación de usuario a la ruta de creación de usuario.
    // Esto asegura que se ejecuten las validaciones de la cadena antes de que la
    // petición llegue al controlador.
    consumer.apply(UserValidationMiddleware).forRoutes('user');
  }
}
