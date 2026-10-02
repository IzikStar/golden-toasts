/**
 * End-to-end tests: boot the real AppModule against a real PostgreSQL
 * database and drive it over HTTP. Run with `npx nx e2e backend`.
 */
export default {
  displayName: 'backend-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  rootDir: '.',
  roots: ['<rootDir>/e2e'],
  testMatch: ['**/*.e2e-spec.ts'],
  setupFiles: ['<rootDir>/e2e/setup-env.ts'],
};
