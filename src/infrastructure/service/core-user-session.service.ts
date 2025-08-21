import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreUserSession } from 'generated/prisma';
import { CoreUserSessionRepository } from '../repository/core-user-session.repository';
import { CreateCoreUserSessionDto } from 'src/application/dto/core-user-session/create-core-user-session.dto';
import { UpdateCoreUserSessionDto } from 'src/application/dto/core-user-session/update-core-user-session.dto';

@Injectable()
export class CoreUserSessionService extends BaseService<CoreUserSession> {
  constructor(private readonly coreUserSessionRepository: CoreUserSessionRepository) {
    super(coreUserSessionRepository);
  }

  async create(dto: CreateCoreUserSessionDto): Promise<CoreUserSession> {
    return await this.coreUserSessionRepository.save(dto);
  }

  async update(id: string, dto: UpdateCoreUserSessionDto): Promise<CoreUserSession> {
    await this.findById(id);
    return await this.coreUserSessionRepository.update(id, dto);
  }

  async findByToken(token: string): Promise<CoreUserSession> {
    const session = await this.coreUserSessionRepository.findByToken(token);
    if (!session) {
      throw new NotFoundException(`Session with token not found`);
    }
    return session;
  }

  async findActiveByUserId(userId: string): Promise<CoreUserSession[]> {
    return await this.coreUserSessionRepository.findActiveByUserId(userId);
  }

  async revokeSession(id: string): Promise<CoreUserSession> {
    await this.findById(id);
    return await this.coreUserSessionRepository.revokeSession(id);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.coreUserSessionRepository.revokeAllUserSessions(userId);
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.coreUserSessionRepository.cleanExpiredSessions();
  }

  async validateSession(token: string): Promise<boolean> {
    try {
      const session = await this.findByToken(token);
      return session.expiresAt > new Date() && !session.revokedAt;
    } catch {
      return false;
    }
  }
}
