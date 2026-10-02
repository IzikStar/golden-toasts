import {
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

const defaultLogger = new Logger('ErrorHandler');

export function handleError(
  error: unknown,
  customMessage = 'Unexpected error',
  logger: Logger = defaultLogger
): never {
  const originalMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Unknown error';

  const fullMessage = `${customMessage}: ${originalMessage}`;

  logger.error(fullMessage, error);

  if (error instanceof HttpException) {
    throw new HttpException(fullMessage, error.getStatus());
  }

  throw new InternalServerErrorException(fullMessage);
}
