import { HTTPVerb, Interceptor, Route } from '../../types/routes.js';

export async function runMiddlewares(request: Request, route: Route) {
  const verb = request.method.toLowerCase() as HTTPVerb;
  const middlewares = [route.middlewares || [], route[verb]?.middlewares || []].flat();

  for (const middleware of middlewares) {
    const result = await middleware(request);
    if (result instanceof Response) return result;
  }
}

export async function runInterceptors<T>(interceptors: Interceptor<T>[], arg: T) {
  for await (const interceptor of interceptors) {
    const result = await interceptor(arg);
    if (result) throw result;
  }
}
