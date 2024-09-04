import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const SongModel = sqliteTable('songs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  url: text('url').notNull(),
  image: text('image').notNull(),
  duration: integer('duration').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
