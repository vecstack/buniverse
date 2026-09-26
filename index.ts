import useServerContext from './src/hooks/useContext.js';
import useRequest from './src/hooks/useRequest.js';
import { bootstrap } from './src/bootstrap.js';

const Buniverse = {
  useRequest,
  useServerContext,
  bootstrap,
};

export { useRequest, useServerContext, bootstrap };
export type { RequestHandler } from './src/router/router-adapter.js';
export default Buniverse;
