import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/service/prisma.service';

@Module({
  providers: [
    PrismaService
  ],
  exports: [
    PrismaService
  ]
})
export class RepositoryModule {}
