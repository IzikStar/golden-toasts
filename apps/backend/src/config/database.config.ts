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
  autoLoadModels: true,
  synchronize: true,
});
