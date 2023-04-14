import { Handler, useSchema } from 'buniverse';
import { Response } from 'buniverse/runtime'
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.string(),
  file: z.instanceof(Blob)
});

const Home: Handler = async (req) => {
  const body = await useSchema(userSchema);
  return new Response(body);
};
export default Home;
