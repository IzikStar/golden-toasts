import { Logger } from '@nestjs/common';

const DEV_FALLBACK_SECRET = 'super-secret';
const MIN_PRODUCTION_SECRET_LENGTH = 32;
const KNOWN_PUBLIC_SECRETS = [DEV_FALLBACK_SECRET, 'change-me-to-a-long-random-string'];

/**
 * Resolves the secret used to sign and verify JWTs.
 *
 * - In production (NODE_ENV=production) JWT_SECRET must be set, must not be a
 *   value published in this repository, and must be at least 32 characters;
 *   otherwise the app refuses to start.
 * - In development it falls back to a fixed, clearly insecure value and logs a warning.
 */
export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (
      !secret ||
      KNOWN_PUBLIC_SECRETS.includes(secret) ||
      secret.length < MIN_PRODUCTION_SECRET_LENGTH
    ) {
      throw new Error(
        `JWT_SECRET must be set to a private random value of at least ${MIN_PRODUCTION_SECRET_LENGTH} characters when NODE_ENV=production`
      );
    }
    return secret;
  }

  if (secret) {
    return secret;
  }

  Logger.warn(
    'JWT_SECRET is not set - using an insecure development fallback',
    'JwtSecret'
  );

  return DEV_FALLBACK_SECRET;
};
