import { ForbiddenException } from '@nestjs/common';
import { IsAdminGuard } from './is-admin.guard';
import { httpContext, makeUser } from '../../../testing/fixtures';

describe('IsAdminGuard', () => {
  const guard = new IsAdminGuard();

  it('allows an admin', () => {
    const context = httpContext({ user: makeUser({ isAdmin: true }) });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('forbids a regular user', () => {
    const context = httpContext({ user: makeUser({ isAdmin: false }) });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('forbids a request with no authenticated user', () => {
    expect(() => guard.canActivate(httpContext({}))).toThrow(
      ForbiddenException
    );
  });
});
