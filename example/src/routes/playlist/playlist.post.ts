import { ResultFns } from '@/errors/Result';
import { useZodSchema } from '@/hooks/useZodSchema';
import { PlaylistRepo } from '@/repo/playlist.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { z } from 'zod';

const addPlaylistSchema = z.object({
  name: z.string(),
});
const AddPlaylistHandler: AuthorizedHandler = async (req, ctx) => {
  const { name } = await useZodSchema(addPlaylistSchema);
  const result = await PlaylistRepo.createPlaylist(ctx.user.id, name);
  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 201 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(AddPlaylistHandler);
