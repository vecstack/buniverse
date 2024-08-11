import path from 'path';
import { HTTPVerb, type HTTPVerbModule, type MiddlewareModule } from '../router-adapter';

export function createUrl(dirSegments: string[]) {
  return path.posix
    .join(...dirSegments)
    .replaceAll('[', ':')
    .replaceAll(']', '');
}

export async function fetchRouteModule<T>(modulePath: string): Promise<HTTPVerbModule> {
  return await import(modulePath);
}

export async function fetchMiddleware<T>(modulePath: string): Promise<MiddlewareModule> {
  return await import(modulePath);
}

export function NotFound() {
  return new Response('Not Found', {
    status: 404,
  });
}

export function parseRequest(req: Request) {
  req;
  const pathname = new URL(req.url).pathname;
  const verb = req.method.toLowerCase() as HTTPVerb;
  return { pathname, verb };
}

export function createPathResolver(baseUrl: string) {
  return (...pathSegments: string[]) => {
    return path.join(process.cwd(), baseUrl, ...pathSegments);
  };
}
