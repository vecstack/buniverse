import { Handler } from 'atom';
const Me: Handler = (req) => {
  return new Response('Hello, world /mex');
};

export default Me;
