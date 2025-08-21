import { Module } from '@nestjs/common';
import { CalificationController } from './calification.controller';
import { CalificationService } from './calification.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CalificationController],
  providers: [CalificationService, PrismaService],
  exports: [CalificationService],
})
export class CalificationModule {}
