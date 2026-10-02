import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserService } from '../../user/user.service';
import { httpContext, makeUser } from '../../../testing/fixtures';

describe('AuthGuard', () => {
  const payload = { id: 'user-1', username: 'alice', isAdmin: false };

  let jwtService: { verifyAsync: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };
  let userService: { getUserById: jest.Mock };
  let guard: AuthGuard;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn().mockResolvedValue(payload) };
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    userService = { getUserById: jest.fn().mockResolvedValue(makeUser()) };
    guard = new AuthGuard(
      jwtService as unknown as JwtService,
      reflector as unknown as Reflector,
      userService as unknown as UserService
    );
  });

  const requestWithAuth = (authorization?: string) => ({
    headers: authorization ? { authorization } : {},
  });

  it('lets @Public() routes through without looking for a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = httpContext(requestWithAuth());

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects a request without an Authorization header', async () => {
    await expect(
      guard.canActivate(httpContext(requestWithAuth()))
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a token sent with a scheme other than Bearer', async () => {
    await expect(
      guard.canActivate(httpContext(requestWithAuth('Basic abc123')))
    ).rejects.toThrow(UnauthorizedException);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects an invalid or expired token', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

    await expect(
      guard.canActivate(httpContext(requestWithAuth('Bearer bad-token')))
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a valid token whose user no longer exists', async () => {
    userService.getUserById.mockRejectedValue(new NotFoundException());

    await expect(
      guard.canActivate(httpContext(requestWithAuth('Bearer good-token')))
    ).rejects.toThrow(UnauthorizedException);
  });

  it('attaches the token payload to the request for a valid token', async () => {
    const request: Record<string, unknown> =
      requestWithAuth('Bearer good-token');

    await expect(guard.canActivate(httpContext(request))).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('good-token');
    expect(userService.getUserById).toHaveBeenCalledWith('user-1');
    expect(request['user']).toEqual(payload);
  });
});
