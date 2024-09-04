import { db } from '@/database/database';
import { UserFavoritesModel } from '@/database/models/user-favorites.mode';
import { Err, Ok } from '@/errors/Result';
import { and, eq } from 'drizzle-orm';

export const UserFavoritesRepo = {
  getMany: async (userId: string) => {
    const favorites = await db.query.userFavorties.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
      with: {
        song: true,
      },
    });
    return favorites;
  },
  addOne: async (userId: string, songId: string) => {
    const existingFavorite = await db.query.userFavorties.findFirst({
      where(fields, ops) {
        return ops.and(ops.eq(fields.userId, userId), ops.eq(fields.songId, songId));
      },
    });

    if (existingFavorite) {
      return Err({
        message: 'Song already in favorites',
        status: 400,
      });
    }

    const [favorite] = await db
      .insert(UserFavoritesModel)
      .values({
        songId,
        userId,
      })
      .returning();
    return Ok(favorite);
  },

  removeOne: async (userId: string, songId: string) => {
    const favorite = await db.query.userFavorties.findFirst({
      where(fields, ops) {
        return ops.and(ops.eq(fields.userId, userId), ops.eq(fields.songId, songId));
      },
    });
    if (!favorite) {
      return Err({
        message: 'Song not in favorites',
        status: 400,
      });
    }

    await db
      .delete(UserFavoritesModel)
      .where(
        and(
          eq(UserFavoritesModel.userId, favorite.userId),
          eq(UserFavoritesModel.songId, favorite.songId)
        )
      );
    return Ok({
      message: 'Song removed from favorites',
      status: 200,
    });
  },
};
