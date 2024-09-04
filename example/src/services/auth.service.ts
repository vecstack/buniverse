import type { RequestHandler } from 'buniverse';
import { TokensJWT } from './jwt.service';
import { Err, Ok, ResultFns } from '../errors/Result';
import type { UserRole } from '../database/models/user.model';

export type AuthorizedHandler = (
  req: Request,
  context: { user: { id: string } }
) => Promise<Response> | Response;

export const AuthService = {
  async authorize(request: Request, role: UserRole = 'user') {
    const token = request.headers.get('Authorization');
    if (!token) return Err({ message: 'Unauthorized', status: 401 });

    const user = await TokensJWT.verify(token);
    if (!user.success) return Err({ message: 'Unauthorized', status: 401 });

    if (role === 'admin' && user.value.role !== 'admin') {
      return Err({ message: 'Unauthorized', status: 401 });
    }
    return Ok(user.value);
  },
  authorizeHandler(handler: AuthorizedHandler, role: UserRole = 'user'): RequestHandler {
    return async (req) => {
      const result = await AuthService.authorize(req, role);
      return ResultFns.match(result)({
        Ok(value) {
          return handler(req, { user: value });
        },
        Err(error) {
          return Response.json(error, { status: error.status });
        },
      });
    };
  },
};
