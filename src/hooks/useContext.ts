import { AsyncGlobalContext } from '../context';

const useServerContext = () => {
  const asyncGlobalContext = AsyncGlobalContext.getStore();
  if (!asyncGlobalContext) {
    throw new Error('useContext() must be used inside a route handler');
  }
  return asyncGlobalContext;
};

export default useServerContext;
