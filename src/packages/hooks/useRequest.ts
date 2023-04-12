import { globalContext } from '../../server.js';

const useRequest = () => {
  if (!globalContext.request) {
    throw new Error('Hook should be called inside a handler');
  }
  return globalContext.request;
};

export default useRequest;
