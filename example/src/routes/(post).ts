import { RequestHandler } from 'buniverse';
import { Response } from 'buniverse/runtime';
import { z } from 'zod';
import { useZodSchema } from '../hooks/useZodSchema.js';

const userSchema = z.object({
  name: z.string(),
  age: z.string(),
  file: z.instanceof(Blob),
});

const Home: RequestHandler = async (req) => {
  const body = await useZodSchema(userSchema);
  return new Response(body);
};
export default Home;
