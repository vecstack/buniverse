import { AsyncLocalStorage } from 'node:async_hooks';

export interface GlobalContext {
  request: Request | null;
  params?: Record<string, string>;
}

export const AsyncGlobalContext = new AsyncLocalStorage<GlobalContext>();
