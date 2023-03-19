import { Handler } from 'atom';
const Me: Handler = (req) => {
  return new Response('Hello, world');
};

export default Me;
