import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [SubjectService, PrismaService],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
