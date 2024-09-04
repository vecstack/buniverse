import { UserFavoritesRepo } from '@/repo/user-favorites.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';

export type GetFavoritesResponse = {
  id: string;
  name: string;
  url: string;
  image: string;
  duration: number;
  size: number;
}[];

export const GetFavoritesHandler: AuthorizedHandler = async (req, ctx) => {
  const favourites = await UserFavoritesRepo.getMany(ctx.user.id);

  const response: GetFavoritesResponse = favourites.map((favourite) => ({
    id: favourite.song.id,
    name: favourite.song.name,
    url: favourite.song.url,
    image: favourite.song.image,
    duration: favourite.song.duration,
    size: favourite.song.size,
  }));

  return Response.json(response, { status: 200 });
};

export default AuthService.authorizeHandler(GetFavoritesHandler);
