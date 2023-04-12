import { Handler } from 'cerelynn';
import path from 'path';
const Home: Handler = async (req) => {
  const body = await req.formData();
  body.forEach((value, key) => {
    if (value instanceof Blob) {
      console.log(value);
      console.log(process.cwd());

      Bun.write(path.resolve('/public'), value);
    }
  });

  return new Response(`uploaded file with the size`);
};
export default Home;
