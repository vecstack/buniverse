import type { Interceptor } from '../router-adapter';

export const run = async <T>(interceptors: Interceptor<T>[], arg: T) => {
  for await (const interceptor of interceptors) {
    const result = await interceptor(arg);
    if (result) return result;
  }
};
