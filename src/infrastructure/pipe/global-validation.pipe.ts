import {
  BadRequestException,
  ValidationError,
  ValidationPipe
} from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      validationError: { target: false, value: false },
      validateCustomDecorators: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const message =
          this.buildErrorMessage(errors[0]) ?? 'validation failed';
        return new BadRequestException(message);
      }
    });
  }

  private buildErrorMessage(
    error: ValidationError,
    path: string = ''
  ): string | null {
    const currentPath = /^\d+$/.test(error.property)
      ? `${path}[${error.property}]`
      : path
        ? `${path}.${error.property}`
        : error.property;

    if (error.constraints) {
      const constraint = Object.values(error.constraints)[0];
      const cleanMessage = constraint.replace(
        new RegExp(`^${error.property}\\s+`, 'i'),
        ''
      );
      return `${currentPath} ${cleanMessage}`;
    }

    if (error.children && error.children.length > 0) {
      for (const child of error.children) {
        const constraint = this.buildErrorMessage(child, currentPath);
        if (constraint) {
          return constraint;
        }
      }
    }

    return null;
  }
}
