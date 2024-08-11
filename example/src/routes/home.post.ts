import type { RequestHandler } from 'buniverse';
import { z } from 'zod';
import { useZodSchema } from '../hooks/useZodSchema.js';

const userSchema = z.object({
  name: z.string(),
  age: z.string(),
  file: z.instanceof(Blob),
});

const Home: RequestHandler = async (req) => {
  const body = await useZodSchema(userSchema);
  return new Response(JSON.stringify(body));
};
export default Home;
