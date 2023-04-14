import { globalContext } from '../../server.js';

const useRequest = () => {
  if (!globalContext.request) throw new Error("useRequest was not called inside a handler")
  return globalContext.request;
};

export default useRequest;
