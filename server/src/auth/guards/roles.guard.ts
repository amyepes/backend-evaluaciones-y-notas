import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IRequestAuth } from '../request-auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequestAuth>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Get user with role from database
    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true },
    });

    if (!userWithRole) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const hasRole = requiredRoles.includes(userWithRole.role);
    
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    return true;
  }
}
