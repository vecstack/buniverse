import { Server } from '../server/server';

const useServerContext = () => {
  const asyncGlobalContext = Server.context.getStore();
  if (!asyncGlobalContext) {
    throw new Error('useContext() must be used inside a route handler');
  }
  return asyncGlobalContext;
};

export default useServerContext;
