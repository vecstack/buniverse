import { Interceptor } from '../../@types/router.js';

export const runThrowing = async <T>(interceptors: Interceptor<T>[], arg: T) => {
  for await (const interceptor of interceptors) {
    const result = await interceptor(arg);
    if (result) throw result;
  }
};

export const run = async <T>(interceptors: Interceptor<T>[], arg: T) => {
  for await (const interceptor of interceptors) {
    const result = await interceptor(arg);
    if (result) return result;
  }
};
