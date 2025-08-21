import { Module } from '@nestjs/common';
import { AppController } from 'src/application/controller/app.controller';
import { AuthController } from 'src/application/controller/auth.controller';
import { ServiceModule } from 'src/infrastructure/module/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [
    AppController,
    AuthController,
  ]
})
export class ControllerModule {}
