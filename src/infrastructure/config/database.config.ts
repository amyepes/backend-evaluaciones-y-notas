import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DATABASE_URI, NODE_ENV } from '@core/constant/env.constant';

@Injectable()
export class DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>(DATABASE_URI) || '';
  }

  isDevelopment(): boolean {
    return this.configService.get<string>(NODE_ENV, 'development') === 'development';
  }

  isProduction(): boolean {
    return this.configService.get<string>(NODE_ENV, 'development') === 'production';
  }

  getLogLevel(): string[] {
    return this.isDevelopment() ? ['query', 'info', 'warn', 'error'] : ['error'];
  }
}
