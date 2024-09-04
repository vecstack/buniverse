import { ResultFns } from '@/errors/Result';
import { useZodSchema } from '@/hooks/useZodSchema';
import { PlaylistRepo } from '@/repo/playlist.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { z } from 'zod';

const addPlaylistSongSchema = z.object({
  songId: z.string(),
  playlistId: z.string(),
});

const AddPlaylistSongHandler: AuthorizedHandler = async (req, ctx) => {
  const { songId, playlistId } = await useZodSchema(addPlaylistSongSchema);
  const result = await PlaylistRepo.addToPlaylist(ctx.user.id, playlistId, songId);
  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 201 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(AddPlaylistSongHandler);
