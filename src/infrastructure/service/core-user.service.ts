import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { CoreUser } from 'generated/prisma';
import { CoreUserRepository } from '../repository/core-user.repository';
import { CreateCoreUserDto } from 'src/application/dto/core-user/create-core-user.dto';
import { UpdateCoreUserDto } from 'src/application/dto/core-user/update-core-user.dto';
import * as bcrypt from 'bcrypt';

type SafeCoreUser = Omit<CoreUser, 'passwordHash'>;

@Injectable()
export class CoreUserService extends BaseService<CoreUser> {
  constructor(private readonly coreUserRepository: CoreUserRepository) {
    super(coreUserRepository);
  }

  async create(dto: CreateCoreUserDto): Promise<SafeCoreUser> {
    // Check if username exists
    const existingUsername = await this.coreUserRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Check if email exists
    const existingEmail = await this.coreUserRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.coreUserRepository.save({
      ...dto,
      passwordHash,
      password: undefined
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateCoreUserDto): Promise<SafeCoreUser> {
    const existingUser = await this.findById(id);

    // Check username uniqueness if updating
    if (dto.username && dto.username !== existingUser.username) {
      const existingUsername = await this.coreUserRepository.findByUsername(dto.username);
      if (existingUsername) {
        throw new BadRequestException('Username already exists');
      }
    }

    // Check email uniqueness if updating
    if (dto.email && dto.email !== existingUser.email) {
      const existingEmail = await this.coreUserRepository.findByEmail(dto.email);
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Hash password if updating
    let updateData: any = { ...dto };
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      updateData.passwordHash = await bcrypt.hash(dto.password, salt);
      delete updateData.password;
    }

    const user = await this.coreUserRepository.update(id, updateData);
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findByUsername(username: string): Promise<CoreUser | null> {
    return await this.coreUserRepository.findByUsername(username);
  }

  async findByEmail(email: string): Promise<CoreUser | null> {
    return await this.coreUserRepository.findByEmail(email);
  }

  async findAllWithRelations(): Promise<SafeCoreUser[]> {
    const users = await this.coreUserRepository.findAllWithRelations();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async findByIdWithRelations(id: string): Promise<SafeCoreUser> {
    const user = await this.coreUserRepository.findByIdWithRelations(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async findAll(): Promise<SafeCoreUser[]> {
    const users = await this.coreUserRepository.findAll();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async findById(id: string): Promise<CoreUser> {
    const user = await this.coreUserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByIdSafe(id: string): Promise<SafeCoreUser> {
    const user = await this.findById(id);
    const { passwordHash, ...result } = user;
    return result;
  }
}
