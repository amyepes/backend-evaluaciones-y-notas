import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { USERNAMEE } from 'config/config';
import { Request, Response, NextFunction } from 'express';

// Definimos la interfaz del manejador.
interface IValidationHandler {
  setNext(handler: IValidationHandler): IValidationHandler;
  handle(req: Request, res: Response, next: NextFunction): void;
}

// =======================================================
// CLASES MANEJADORAS
// =======================================================

/**
 * Manejador que verifica si el nombre de usuario ya existe.
 */
@Injectable()
export class UsernameValidationHandler implements IValidationHandler {
  private nextHandler: IValidationHandler | undefined;

  setNext(handler: IValidationHandler): IValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    const { username } = req.body;
    // Lógica de validación.
    if (username === USERNAMEE) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }
    
    // Si la validación pasa, pasa al siguiente manejador.
    if (this.nextHandler) {
      this.nextHandler.handle(req, res, next);
    } else {
      // Si no hay más manejadores, continúa con la petición.
      next();
    }
  }
}

/**
 * Manejador que valida la complejidad de la contraseña.
 */
@Injectable()
export class PasswordValidationHandler implements IValidationHandler {
  private nextHandler: IValidationHandler | undefined;

  setNext(handler: IValidationHandler): IValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    const { password } = req.body;
    // Lógica de validación de contraseña.
    if (password.length < 8) {
      throw new BadRequestException('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Si la validación pasa, pasa al siguiente manejador.
    if (this.nextHandler) {
      this.nextHandler.handle(req, res, next);
    } else {
      next();
    }
  }
}

// =======================================================
// MIDDLEWARE PRINCIPAL
// =======================================================

/**
 * Middleware que orquesta la cadena de manejadores de validación.
 */
@Injectable()
export class UserValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // 1. Instanciamos los manejadores.
      const usernameHandler = new UsernameValidationHandler();
      const passwordHandler = new PasswordValidationHandler();

      // 2. Construimos la cadena de responsabilidad.
      usernameHandler.setNext(passwordHandler);

      // 3. Iniciamos la cadena con el primer manejador.
      usernameHandler.handle(req, res, next);

    } catch (error) {
      // Si un manejador lanza una excepción, la capturamos y la pasamos a NestJS.
      next(error);
    }
  }
}
