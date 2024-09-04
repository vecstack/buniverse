import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/models/*.ts',
  out: './drizzle',
  dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite',
  strict: true,
  dbCredentials: {
    url: './sqlite.db',
  },
});
