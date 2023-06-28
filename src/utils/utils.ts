import path from 'path';
import { HTTPVerb, MiddlewareModule, HTTPVerbModule, Router } from '../types/routes.js';

export function getFileSegments(filename: string) {
  const extname = path.extname(filename);
  const name = filename.slice(0, -extname.length);
  return { name, extname };
}

export function isValidExt(ext: string) {
  return ext === '.js' || ext === '.ts';
}

export function isValidName(name: string) {
  return (
    (name.startsWith('(') && name.endsWith(')')) ||
    (name.startsWith('[') && name.endsWith(']')) ||
    name.startsWith('@')
  );
}

export const isHTTPVerb = (str: string): str is HTTPVerb => {
  return (
    str === HTTPVerb.GET ||
    str === HTTPVerb.POST ||
    str === HTTPVerb.PUT ||
    str === HTTPVerb.DELETE ||
    str === HTTPVerb.PATCH
  );
};

export function createUrl(dirSegments: string[]) {
  return path.posix
    .join(...dirSegments)
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('[', ':')
    .replaceAll(']', '');
}

export async function fetchRoute<T>(modulePath: string): Promise<HTTPVerbModule> {
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
  const pathname = new URL(req.url).pathname;
  const verb = req.method.toLowerCase() as HTTPVerb;
  return { pathname, verb };
}

export function createPathResolver(baseUrl: string) {
  return (...pathSegments: string[]) => {
    return path.join(process.cwd(), baseUrl, ...pathSegments);
  };
}

export function enableDebugger(router: Router) {
  router.routes['/debug'] = {
    get: {
      default: async () => {
        return new Response(JSON.stringify(router.routes, null, 2));
      },
    },
  };
}
