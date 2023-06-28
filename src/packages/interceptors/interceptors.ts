import { HTTPVerb, Interceptor, Route } from '../../types/routes.js';

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

export const getRouteMiddlewares = (route: Route, verb: HTTPVerb) => {
  return [route.middlewares || [], route[verb]?.middlewares || []].flat();
};
