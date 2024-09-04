import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from './user.model';
import { SongModel } from './song.model';

export const UserFavoritesModel = sqliteTable('user_favourites', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  songId: text('song_id')
    .references(() => SongModel.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => UserModel.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const UserFavoritesModelRelations = relations(UserFavoritesModel, ({ one }) => ({
  user: one(UserModel, {
    fields: [UserFavoritesModel.userId],
    references: [UserModel.id],
  }),
  song: one(SongModel, {
    fields: [UserFavoritesModel.songId],
    references: [SongModel.id],
  }),
}));
