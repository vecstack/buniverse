import { RequestHandler } from 'buniverse';
export const Home: RequestHandler = async (req) => {
  return new Response('Hello, world');
};
export default Home;
