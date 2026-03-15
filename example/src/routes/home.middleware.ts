import type { RequestHandler } from 'buniverse';

const HomeMiddleware: RequestHandler = (req) => {
  console.log("HEE");

  // Middleware logic here - currently does nothing
  return undefined; // Explicitly return undefined to continue with next middleware
};

export default HomeMiddleware;
