import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';
import { UserFavoritesModel } from './user-favorites.mode';
import { PlaylistModel } from './playlist.model';
export type UserRole = 'admin' | 'user';

export const UserModel = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  role: text('role', { enum: ['admin', 'user'] })
    .default('user')
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const UserModelRelations = relations(UserModel, ({ many }) => ({
  favorites: many(UserFavoritesModel),
  playlists: many(PlaylistModel),
}));
