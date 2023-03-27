import { Handler } from 'cerelynn';

const Home: Handler = (req) => {
  return new Response('Hello world');
};
export default Home;
