import { SequelizeModuleOptions } from '@nestjs/sequelize';

/**
 * Database connection settings, read from the environment.
 * Defaults match a local PostgreSQL instance for development.
 */
export const getDatabaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'toastsDB',
  // Set DB_LOGGING=false to silence Sequelize's SQL logging (used by the e2e tests).
  logging: process.env.DB_LOGGING === 'false' ? false : console.log,
  autoLoadModels: true,
  synchronize: true,
});
