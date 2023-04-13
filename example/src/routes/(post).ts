import { Handler, useSchema } from 'cerelynn';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.string(),
  file: z.any()
});
const Home: Handler = async (req) => {
  const body = await useSchema(userSchema);

  return new Response(JSON.stringify(body));
};
export default Home;
