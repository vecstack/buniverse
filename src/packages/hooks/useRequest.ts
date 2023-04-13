import { globalContext } from '../../server.js';

const useRequest = () => {
  return globalContext.request;
};

export default useRequest;
