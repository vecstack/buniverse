import { AsyncLocalStorage } from 'node:async_hooks';

export interface GlobalContext {
  request: Request | null;
  [key: string]: any;
}

export const AsyncGlobalContext = new AsyncLocalStorage<GlobalContext>();
