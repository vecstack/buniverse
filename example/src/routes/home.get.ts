import { type RequestHandler } from 'buniverse';

const Home: RequestHandler = async (req) => {
  return new Response('Hello world');
};
export default Home;
