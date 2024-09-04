import { db } from '@/database/database';
import { PlaylistModel, PlaylistSongsModel } from '@/database/models/playlist.model';
import { Err, Ok } from '@/errors/Result';
import { and, eq } from 'drizzle-orm';

export const PlaylistRepo = {
  async delete(userId: string, playlistId: string) {
    const playlist = await db.query.playlist.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.userId, userId),
          operators.eq(fields.id, playlistId)
        );
      },
    });

    if (!playlist) {
      return Err({
        message: 'Cannot find request playlist',
        status: 404,
      });
    }

    await db
      .delete(PlaylistModel)
      .where(and(eq(PlaylistModel.userId, userId), eq(PlaylistModel.id, playlistId)))
      .returning();

    return Ok({
      message: 'Playlist deleted successfully',
      status: 200,
    });
  },
  async getPlaylists(userId: string) {
    const playlists = await db.query.playlist.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
    });

    return playlists;
  },
  async getPlaylist(userId: string, playlistId: string) {
    const playlist = await db.query.playlist.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.userId, userId),
          operators.eq(fields.id, playlistId)
        );
      },
      with: {
        playlistSongs: {
          with: {
            song: true,
          },
        },
      },
    });

    if (!playlist) {
      return Err({
        message: 'Playlist not found',
        status: 404,
      });
    }

    return Ok(playlist);
  },
  async createPlaylist(userId: string, name: string) {
    const existingPlaylist = await db.query.playlist.findFirst({
      where(fields, operators) {
        return operators.eq(fields.name, name);
      },
      columns: {
        name: true,
      },
    });

    if (existingPlaylist) {
      return Err({
        message: 'Playlist already exists',
        status: 400,
      });
    }

    const [playlist] = await db
      .insert(PlaylistModel)
      .values({
        userId,
        name,
      })
      .returning();
    return Ok(playlist);
  },
  async addToPlaylist(userId: string, playlistId: string, songId: string) {
    const playlist = await db.query.playlist.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.id, playlistId),
          operators.eq(fields.userId, userId)
        );
      },
    });

    if (!playlist) {
      return Err({
        message: 'Playlist not found',
        status: 404,
      });
    }

    const existingSong = await db.query.playlistSongs.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.playlistId, playlistId),
          operators.eq(fields.songId, songId)
        );
      },
    });

    if (existingSong) {
      return Err({
        message: 'Song already in playlist',
        status: 400,
      });
    }

    await db.insert(PlaylistSongsModel).values({
      playlistId,
      songId,
    });

    return Ok({
      message: 'Song added to playlist',
    });
  },
};
