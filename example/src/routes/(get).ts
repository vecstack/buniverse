import { Handler } from '../../../index.js';

const Home: Handler = async (req) => {
  return new Response('Hello world');
};
export default Home;
