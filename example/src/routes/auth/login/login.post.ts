import type { RequestHandler } from 'buniverse';
import { z } from 'zod';
import { useZodSchema } from '../../../hooks/useZodSchema';
import { db } from '../../../database/database';
import { TokensJWT } from '../../../services/jwt.service';
import { ResultFns } from '../../../errors/Result';

const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginResponse = {
  token: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

const LoginHandler: RequestHandler = async (req) => {
  const body = await useZodSchema(LoginDTO);

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, body.email);
    },
  });

  if (!user) {
    return Response.json({ message: 'Invalid credentials' }, { status: 404 });
  }

  if (!Bun.password.verify(body.password, user.password)) {
    return Response.json({ message: 'Invalid credentials' }, { status: 404 });
  }

  let tokenResult = await TokensJWT.sign({ id: user.id, role: user.role });
  const token = ResultFns.unwrapOr(tokenResult, null);

  if (!token) {
    return Response.json({ message: 'Something went wrong' }, { status: 500 });
  }

  const response: LoginResponse = {
    token: token,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return Response.json(response, { status: 200 });
};

export default LoginHandler;
