import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from './user.model';
import { SongModel } from './song.model';

export const PlaylistModel = sqliteTable('playlists', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('user_id')
    .notNull()
    .references(() => UserModel.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const PlaylistModelRelations = relations(PlaylistModel, ({ one, many }) => ({
  user: one(UserModel, {
    fields: [PlaylistModel.userId],
    references: [UserModel.id],
  }),
  playlistSongs: many(PlaylistSongsModel),
}));

export const PlaylistSongsModel = sqliteTable(
  'playlist_songs',
  {
    playlistId: text('playlist_id')
      .notNull()
      .references(() => PlaylistModel.id, { onDelete: 'cascade' }),
    songId: text('song_id')
      .notNull()
      .references(() => SongModel.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.playlistId, t.songId] }),
  })
);

export const PlaylistSongsModelRelations = relations(PlaylistSongsModel, ({ one }) => ({
  playlist: one(PlaylistModel, {
    fields: [PlaylistSongsModel.playlistId],
    references: [PlaylistModel.id],
  }),
  song: one(SongModel, {
    fields: [PlaylistSongsModel.songId],
    references: [SongModel.id],
  }),
}));
