import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from 'config/config';
import { ValidationPipe } from '@nestjs/common';

// =======================================================
// Patrón de Diseño: Proxy para Logging
// =======================================================

// 1. Interfaz de Sujeto (Subject)
// Define los métodos que tanto el objeto real como el proxy deben implementar.
interface ILogger {
  log(message: string): void;
  warn(message: string): void;
  error(message: string, trace?: string): void;
}

// 2. Objeto Real (Real Subject)
// La clase que realiza la acción principal (en este caso, el logging real).
class RealLogger implements ILogger {
  log(message: string): void {
    console.log(`LOG: ${message}`);
  }

  warn(message: string): void {
    console.warn(`WARN: ${message}`);
  }

  error(message: string, trace?: string): void {
    console.error(`ERROR: ${message}`, trace);
  }
}

// 3. Objeto Proxy (Proxy)
// La clase que envuelve al objeto real y añade su propia lógica.
class LoggingProxy implements ILogger {
  private realLogger: RealLogger;

  constructor() {
    this.realLogger = new RealLogger();
  }

  private addTimestamp(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }

  log(message: string): void {
    const proxiedMessage = this.addTimestamp(`[LOG] ${message}`);
    this.realLogger.log(proxiedMessage);
  }

  warn(message: string): void {
    const proxiedMessage = this.addTimestamp(`[WARN] ${message}`);
    this.realLogger.warn(proxiedMessage);
  }

  error(message: string, trace?: string): void {
    const proxiedMessage = this.addTimestamp(`[ERROR] ${message}`);
    this.realLogger.error(proxiedMessage, trace);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Usamos el Proxy Logger en lugar del logger por defecto de NestJS
  const loggerProxy = new LoggingProxy();
  app.useLogger(loggerProxy);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });
  
  await app.listen(PORT ?? 3000);
}
void bootstrap();
