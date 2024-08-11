import type { RequestHandler } from 'buniverse';
import { z } from 'zod';
import { useZodSchema } from '../../../hooks/useZodSchema';

const dto = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});
const SignupHandler: RequestHandler = async (req) => {
  const body = await useZodSchema(dto);

  return new Response('Login page');
};

export default SignupHandler;
