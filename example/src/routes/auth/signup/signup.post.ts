import type { RequestHandler } from 'buniverse';
import { z } from 'zod';

import { useZodSchema } from '../../../hooks/useZodSchema';
import { TokensJWT } from '../../../services/jwt.service';
import { UserRepo } from '@/repo/user.repo';

const SignupDTO = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupResponse = {
  token: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

const SignupHandler: RequestHandler = async (req) => {
  const body = await useZodSchema(SignupDTO);
  const existingUser = await UserRepo.findOneByEmail(body.email);
  if (!existingUser.success) {
    return Response.json(existingUser.error, { status: existingUser.error.status });
  }

  if (existingUser.value !== null) {
    return Response.json(
      { message: 'User with this email already exists' },
      { status: 400 }
    );
  }

  const user = await UserRepo.createOne({
    name: body.name,
    email: body.email,
    password: Bun.password.hashSync(body.password),
  });

  if (!user.success) {
    return Response.json(user.error, { status: user.error.status });
  }

  const token = await TokensJWT.sign({ id: user.value.id, role: user.value.role });
  if (!token.success) {
    return Response.json({ message: 'Something went wrong' }, { status: 500 });
  }

  const response: SignupResponse = {
    token: token.value,
    id: user.value.id,
    name: user.value.name,
    email: user.value.email,
    role: user.value.role,
  };

  return Response.json(response, { status: 200 });
};

export default SignupHandler;
