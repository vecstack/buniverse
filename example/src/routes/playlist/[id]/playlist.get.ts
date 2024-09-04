import { ResultFns } from '@/errors/Result';
import { PlaylistRepo } from '@/repo/playlist.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { useParams } from 'buniverse/router/fs';

export type TPlaylist = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  songs: {
    id: string;
    url: string;
    name: string;
    image: string;
    duration: number;
    size: number;
  }[];
};

const GetPlaylistHandler: AuthorizedHandler = async (_, ctx) => {
  const { id } = useParams();
  const playlist = await PlaylistRepo.getPlaylist(ctx.user.id, id);
  return ResultFns.match(playlist)({
    Ok(value) {
      const response: TPlaylist = {
        id: value.id,
        name: value.name,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        songs: value.playlistSongs.map((playlistSong) => ({
          id: playlistSong.song.id,
          url: playlistSong.song.url,
          name: playlistSong.song.name,
          image: playlistSong.song.image,
          duration: playlistSong.song.duration,
          size: playlistSong.song.size,
        })),
      };
      return Response.json(response, { status: 200 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(GetPlaylistHandler);
