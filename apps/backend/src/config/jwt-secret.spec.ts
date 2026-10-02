import { Logger } from '@nestjs/common';
import { getJwtSecret } from './jwt-secret';

describe('getJwtSecret', () => {
  const originalEnv = { ...process.env };
  const strongSecret = 'a'.repeat(16) + 'b'.repeat(16); // 32 characters

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  const setEnv = (nodeEnv: string, secret?: string) => {
    process.env.NODE_ENV = nodeEnv;
    if (secret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = secret;
    }
  };

  describe('in production', () => {
    it('returns a private secret of at least 32 characters', () => {
      setEnv('production', strongSecret);

      expect(getJwtSecret()).toBe(strongSecret);
    });

    it('refuses to start without JWT_SECRET', () => {
      setEnv('production');

      expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
    });

    it('refuses an empty JWT_SECRET', () => {
      setEnv('production', '');

      expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
    });

    it('refuses a secret shorter than 32 characters', () => {
      setEnv('production', 'x'.repeat(31));

      expect(() => getJwtSecret()).toThrow(/at least 32 characters/);
    });

    it.each(['super-secret', 'change-me-to-a-long-random-string'])(
      'refuses the value published in the repository (%s), whatever its length',
      (publicSecret) => {
        setEnv('production', publicSecret);

        expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
      }
    );
  });

  describe('outside production', () => {
    it('uses JWT_SECRET when it is set, even if it is short', () => {
      setEnv('development', 'short');

      expect(getJwtSecret()).toBe('short');
    });

    it('falls back to the insecure development secret and warns', () => {
      const warn = jest.spyOn(Logger, 'warn').mockImplementation();
      setEnv('development');

      expect(getJwtSecret()).toBe('super-secret');
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('insecure development fallback'),
        'JwtSecret'
      );
    });
  });
});
