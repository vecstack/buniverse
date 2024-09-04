import { ResultFns } from '@/errors/Result';
import { useZodSchema } from '@/hooks/useZodSchema';
import { UserFavoritesRepo } from '@/repo/user-favorites.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { z } from 'zod';

const deleteFavoriteSchema = z.object({
  songId: z.string(),
});

const AddFavoriteHandler: AuthorizedHandler = async (_, ctx) => {
  const { songId } = await useZodSchema(deleteFavoriteSchema);
  const result = await UserFavoritesRepo.removeOne(ctx.user.id, songId);
  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 201 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(AddFavoriteHandler);
