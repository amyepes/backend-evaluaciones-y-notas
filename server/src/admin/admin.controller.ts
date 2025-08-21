/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('system')
  async getSystemStats() {
    return await this.adminService.getSystemStats();
  }

  @Get('monthly')
  async getMonthlyStats() {
    return await this.adminService.getMonthlyStats();
  }
}
