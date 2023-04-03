import { match } from 'path-to-regexp';
import { Routes } from '../../types/routes.js';

export function matchRoute(routes: Routes, pathname: string) {
  let pathObject = null;
  if (routes[pathname]) return { route: routes[pathname], params: {} };
  for (const routePath in routes) {
    const matcher = match(routePath);
    const result = matcher(pathname);
    if (result) {
      pathObject = {
        route: routes[routePath],
        params: result.params as Record<string, string>,
      };
      break;
    }
  }
  return pathObject;
}
