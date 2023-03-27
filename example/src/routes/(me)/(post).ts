import { Handler } from 'cerelynn';
export const Home: Handler = async (req) => {
  return new Response('Hello, world');
};
export default Home;
