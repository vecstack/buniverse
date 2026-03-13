import useServerContext from './src/hooks/useContext.js';
import useRequest from './src/hooks/useRequest.js';

const Buniverse = {
  useRequest,
  useServerContext,
};

export { useRequest, useServerContext };
export type { RequestHandler } from './src/router-adapter.js';
export default Buniverse;
