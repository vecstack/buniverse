import { z } from 'zod';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { ResultFns } from '@/errors/Result';
import { useZodSchema } from '@/hooks/useZodSchema';
import { UserFavoritesRepo } from '@/repo/user-favorites.repo';

const addFavoriteSchema = z.object({
  songId: z.string(),
});

const AddFavoriteHandler: AuthorizedHandler = async (_, ctx) => {
  const { songId } = await useZodSchema(addFavoriteSchema);
  const result = await UserFavoritesRepo.addOne(ctx.user.id, songId);
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
