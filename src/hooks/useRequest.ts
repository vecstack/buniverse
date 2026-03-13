import { Server } from "../server/server";

const useRequest = () => {
  const asyncGlobalContext = Server.context.getStore();
  if (!asyncGlobalContext || !asyncGlobalContext.request) {
    throw new Error('useRequest() must be used inside a route handler');
  }
  return asyncGlobalContext.request;
};

export default useRequest;
