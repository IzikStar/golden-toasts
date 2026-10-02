import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { makeUser, compileTestingModule } from '../../testing/fixtures';

describe('AuthService', () => {
  const password = 'Secret123';
  let passwordHash: string;
  let userService: { findByUsername: jest.Mock };
  let jwtService: { sign: jest.Mock };
  let authService: AuthService;

  beforeAll(async () => {
    // Low cost factor keeps the test fast; the comparison logic is identical.
    passwordHash = await bcrypt.hash(password, 4);
  });

  beforeEach(async () => {
    userService = { findByUsername: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('signed.jwt.token') };

    const moduleRef = await compileTestingModule([
      AuthService,
      { provide: UserService, useValue: userService },
      { provide: JwtService, useValue: jwtService },
    ]);

    authService = moduleRef.get(AuthService);
  });

  it('issues a 30-day token carrying id, username and admin flag', async () => {
    userService.findByUsername.mockResolvedValue(
      makeUser({
        id: 'u-9',
        username: 'bob',
        isAdmin: true,
        password: passwordHash,
      })
    );

    await expect(
      authService.login({ username: 'bob', password })
    ).resolves.toEqual({ accessToken: 'signed.jwt.token' });
    expect(jwtService.sign).toHaveBeenCalledWith(
      { id: 'u-9', username: 'bob', isAdmin: true },
      { expiresIn: '30d' }
    );
  });

  it('rejects a wrong password', async () => {
    userService.findByUsername.mockResolvedValue(
      makeUser({ password: passwordHash })
    );

    await expect(
      authService.login({ username: 'alice', password: 'Wrong1234' })
    ).rejects.toThrow(UnauthorizedException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('rejects an unknown username with the same generic error', async () => {
    userService.findByUsername.mockRejectedValue(new NotFoundException());

    await expect(
      authService.login({ username: 'ghost', password })
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });
});
