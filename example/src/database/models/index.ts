import {
  PlaylistModel,
  PlaylistModelRelations,
  PlaylistSongsModel,
  PlaylistSongsModelRelations,
} from './playlist.model';
import { SongModel } from './song.model';
import { UserFavoritesModel, UserFavoritesModelRelations } from './user-favorites.mode';
import { UserModel, UserModelRelations } from './user.model';

export const schema = {
  users: UserModel,
  userRelations: UserModelRelations,
  songs: SongModel,
  userFavorties: UserFavoritesModel,
  userFavoritesRelations: UserFavoritesModelRelations,
  playlist: PlaylistModel,
  playlistRelations: PlaylistModelRelations,
  playlistSongs: PlaylistSongsModel,
  playlistSongsRelations: PlaylistSongsModelRelations,
};
