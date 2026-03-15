import path from 'path';
import { HTTPVerb, type RequestHandler } from '../router-adapter';
import { ReactServer } from '../react/react';

export function createUrl(dirSegments: string[]) {
  return path.posix
    .join(...dirSegments)
    .replaceAll('[', ':')
    .replaceAll(']', '');
}

type RouteModule = {
  default: RequestHandler
  middlewares: RequestHandler[]
}

type MiddlewareOnlyModule = {
  default: RequestHandler
}
export async function fetchRouteModule(modulePath: string): Promise<RouteModule> {
  return await ReactServer.fetchModule(modulePath);
}

export async function fetchMiddleware(modulePath: string): Promise<MiddlewareOnlyModule> {
  return await ReactServer.fetchModule(modulePath);
}

export function NotFound() {
  return new Response('Not Found', {
    status: 404,
  });
}

export function parseRequest(req: Request) {
  const pathname = new URL(req.url).pathname;
  const verb = req.method.toUpperCase() as HTTPVerb;
  return { pathname, verb };
}

export function createPathResolver(baseUrl: string) {
  return (...pathSegments: string[]) => {
    return path.join(process.cwd(), baseUrl, ...pathSegments);
  };
}
