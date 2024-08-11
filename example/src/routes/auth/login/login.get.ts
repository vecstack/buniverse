import type { RequestHandler } from 'buniverse';

const LoginHandler: RequestHandler = async (req) => {
  return new Response('Login page');
};

export default LoginHandler;
