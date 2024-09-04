import { ResultFns } from '../../errors/Result';
import { UserRepo } from '../../repo/user.repo';
import { AuthService, type AuthorizedHandler } from '../../services/auth.service';

export type GetUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};
const UserGetHandler: AuthorizedHandler = async (req: Request, ctx) => {
  const user = await UserRepo.findOneById(ctx.user.id);
  return ResultFns.match(user)({
    Ok(user) {
      const response: GetUserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return Response.json(response, { status: 200 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(UserGetHandler);
