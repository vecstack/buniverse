import { Context } from '../context/context';

const useRequest = () => {
  const asyncGlobalContext = Context.get();
  if (!asyncGlobalContext || !asyncGlobalContext.request) {
    throw new Error('useRequest() must be used inside a route handler');
  }
  return asyncGlobalContext.request;
};

export default useRequest;
