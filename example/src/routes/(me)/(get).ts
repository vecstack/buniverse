import { RequestHandler } from 'buniverse';
const Me: RequestHandler = (req) => {
  return new Response('Hello, world /mex');
};

export default Me;
