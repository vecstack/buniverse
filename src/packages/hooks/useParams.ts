import { globalContext } from '../../server.js';

const useParams = () => {
  return globalContext.requestParams;
};
export default useParams;
