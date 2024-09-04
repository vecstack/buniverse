import { ResultFns } from '@/errors/Result';
import { PlaylistRepo } from '@/repo/playlist.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { useParams } from 'buniverse/router/fs';

const DeletePlaylistHandler: AuthorizedHandler = async (_, ctx) => {
  const { id } = useParams();
  const result = await PlaylistRepo.delete(ctx.user.id, id);
  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 200 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(DeletePlaylistHandler);
