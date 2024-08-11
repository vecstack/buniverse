import { AsyncGlobalContext } from '../context';

const useRequest = () => {
  const asyncGlobalContext = AsyncGlobalContext.getStore();
  if (!asyncGlobalContext || !asyncGlobalContext.request) {
    throw new Error('useRequest() must be used inside a route handler');
  }
  return asyncGlobalContext.request;
};

export default useRequest;
