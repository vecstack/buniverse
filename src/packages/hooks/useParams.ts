import { globalContext } from '../../server.js';

const useParams = () => {
  if (!globalContext.requestParams)
    throw new Error('useParams() must be used inside a route handler');
  return globalContext.requestParams;
};
export default useParams;
