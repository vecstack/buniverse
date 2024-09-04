import { PlaylistRepo } from '@/repo/playlist.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';

const GetPlaylistsHandler: AuthorizedHandler = async (req, ctx) => {
  const playlists = await PlaylistRepo.getPlaylists(ctx.user.id);
  return Response.json(playlists, { status: 200 });
};

export default AuthService.authorizeHandler(GetPlaylistsHandler);
