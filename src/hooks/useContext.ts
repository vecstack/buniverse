import { Context } from '../context/context';

const useServerContext = () => {
  const asyncGlobalContext = Context.get();
  if (!asyncGlobalContext) {
    throw new Error('useContext() must be used inside a route handler');
  }
  return asyncGlobalContext;
};

export default useServerContext;
