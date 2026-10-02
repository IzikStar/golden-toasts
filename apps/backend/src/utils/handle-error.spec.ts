import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { handleError } from './handle-error';

describe('handleError', () => {
  const logger = { error: jest.fn() } as unknown as Logger;

  const captureThrown = (fn: () => never): unknown => {
    try {
      fn();
    } catch (error) {
      return error;
    }
    throw new Error('expected handleError to throw');
  };

  it.each([
    [new NotFoundException('missing'), HttpStatus.NOT_FOUND],
    [new ForbiddenException('nope'), HttpStatus.FORBIDDEN],
  ])('keeps the HTTP status of %p', (original, status) => {
    const thrown = captureThrown(() => handleError(original, 'ctx', logger));

    expect(thrown).toBeInstanceOf(HttpException);
    expect((thrown as HttpException).getStatus()).toBe(status);
    expect((thrown as HttpException).message).toBe(`ctx: ${original.message}`);
  });

  it('turns unknown errors into a 500 and logs them', () => {
    const original = new Error('connection refused');

    const thrown = captureThrown(() =>
      handleError(original, 'Failed to load', logger)
    );

    expect(thrown).toBeInstanceOf(InternalServerErrorException);
    expect((thrown as Error).message).toBe(
      'Failed to load: connection refused'
    );
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to load: connection refused',
      original
    );
  });

  it('handles non-Error values', () => {
    expect(
      (captureThrown(() => handleError('boom', 'ctx', logger)) as Error).message
    ).toBe('ctx: boom');
    expect(
      (captureThrown(() => handleError(42, 'ctx', logger)) as Error).message
    ).toBe('ctx: Unknown error');
  });
});
