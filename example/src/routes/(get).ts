import { RequestHandler } from '../../../index.js';

const Home: RequestHandler = async (req) => {
  return new Response('Hello world');
};
export default Home;
