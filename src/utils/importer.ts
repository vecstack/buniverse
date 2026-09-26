import type { RequestHandler } from '../router/router-adapter';
type RouteModule = {
  default: RequestHandler;
  middlewares: RequestHandler[];
};

type MiddlewareOnlyModule = {
  default: RequestHandler;
};

async function fetchRouteModule(modulePath: string): Promise<RouteModule> {
  return await import(modulePath);
}

async function fetchMiddleware(modulePath: string): Promise<MiddlewareOnlyModule> {
  return await import(modulePath);
}

export const Importer = {
  fetchRouteModule,
  fetchMiddleware,
};
