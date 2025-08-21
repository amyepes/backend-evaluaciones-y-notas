import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/infrastructure/config/env.config';
import { ControllerModule } from 'src/infrastructure/module/controller.module';

@Module({
  imports: [
    ControllerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema
    }),
  ]
})
export class AppModule {}
