import { z } from 'zod';
import { UserRepo } from '@/repo/user.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { useZodSchema } from '@/hooks/useZodSchema';
import { ResultFns } from '@/errors/Result';

const UpdateUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export type UpdateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};
const UserUpdateHandler: AuthorizedHandler = async (req: Request, ctx) => {
  const body = await useZodSchema(UpdateUserSchema);

  const userResult = await UserRepo.findOneById(ctx.user.id);
  if (!userResult.success) {
    return Response.json(userResult.error, { status: userResult.error.status });
  }

  const updateResult = await UserRepo.updateOneById(ctx.user.id, body);
  return ResultFns.match(updateResult)({
    Ok(value) {
      return Response.json(value, { status: 200 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(UserUpdateHandler);
