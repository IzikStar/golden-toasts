import { Logger } from '@nestjs/common';

/**
 * The e2e suite drops and recreates every table, so it must never point at a
 * development database. It always uses E2E_DB_NAME (default `toasts_e2e`),
 * and refuses any name that doesn't look like a throwaway test database.
 */
const databaseName = process.env.E2E_DB_NAME ?? 'toasts_e2e';

if (!/(e2e|test)/i.test(databaseName)) {
  throw new Error(
    `Refusing to run e2e tests against "${databaseName}": the database name must contain "e2e" or "test"`
  );
}

process.env.DB_NAME = databaseName;
process.env.DB_LOGGING = 'false';

Logger.overrideLogger(false);
