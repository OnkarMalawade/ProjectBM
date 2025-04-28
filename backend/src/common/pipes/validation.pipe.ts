import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  ValidationPipe as BaseValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
  constructor() {
    super({
      whitelist: true, // Only allow defined DTO properties
      forbidNonWhitelisted: true, // Throw error if extra fields
      transform: true, // Auto-transform payload to DTO classes
    });
  }
}
