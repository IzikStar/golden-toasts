import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  LoggerService,
  Provider,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/user/entities/user.entity';
import { Toast } from '../modules/toast/entities/toast.entity';
import { ToastLocation } from '../modules/toast/entities/toast-location.enum';

/**
 * Plain-object stand-ins for Sequelize instances. Services only read fields
 * and call `save()`, so a full model instance (and a database) isn't needed.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export const daysFromNow = (days: number): Date =>
  new Date(Date.now() + days * DAY_MS);

export const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    username: 'alice',
    isAdmin: false,
    isPersonaNonGrata: false,
    ...overrides,
  } as User);

export const makeToast = (overrides: Partial<Toast> = {}): Toast =>
  ({
    id: 'toast-1',
    title: 'Promotion',
    reason: 'Got promoted',
    dueDate: daysFromNow(7),
    isDone: false,
    userId: 'user-1',
    foods: ['pizza'],
    drinks: ['beer'],
    location: ToastLocation.ON_BALCONY,
    customLocation: undefined,
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as Toast);

/** Minimal HTTP ExecutionContext for exercising guards. */
export const httpContext = (
  request: Record<string, unknown>
): ExecutionContext => {
  const handler = () => undefined;
  class TestController {}

  return {
    getHandler: () => handler,
    getClass: () => TestController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
};

/**
 * Services pass errors through `handleError`, which re-throws them as a plain
 * HttpException with the same status, so assert on the status code rather
 * than on the exception class.
 */
export const expectHttpError = async (
  promise: Promise<unknown>,
  status: HttpStatus
): Promise<void> => {
  const error = await promise.then(
    () => {
      throw new Error(
        `Expected an HTTP ${status} error, but the call succeeded`
      );
    },
    (rejection: unknown) => rejection
  );

  expect(error).toBeInstanceOf(HttpException);
  expect((error as HttpException).getStatus()).toBe(status);
};

const silentLogger: LoggerService = {
  log: () => undefined,
  error: () => undefined,
  warn: () => undefined,
};

/**
 * Compiles a Nest testing module. The services log every rejected request,
 * so the logger is silenced to keep test output readable.
 */
export const compileTestingModule = (
  providers: Provider[]
): Promise<TestingModule> =>
  Test.createTestingModule({ providers }).setLogger(silentLogger).compile();
