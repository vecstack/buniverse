import { Handler } from 'atom';

const Home: Handler = (req) => {
  return new Response('Hello world');
};
export default Home;
