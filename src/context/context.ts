import { AsyncLocalStorage } from 'node:async_hooks';

export interface GlobalContext {
  request: Request | null;
  params?: Record<string, string>;
}

const AsyncGlobalContext = new AsyncLocalStorage<GlobalContext>();

const run = <T>(context: GlobalContext, callback: () => Promise<T> | T) => {
  return AsyncGlobalContext.run(context, callback);
};

export const get = (): GlobalContext => {
  const context = AsyncGlobalContext.getStore();
  return context || { request: null };
};

export const Context = {
  run,
  get,
};
