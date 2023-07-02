import { match } from 'path-to-regexp';
import path from 'path';
import fs from 'fs/promises';
import {
  HTTPVerbModule,
  RouteMatcher,
  RouteMatch,
  HTTPVerb,
} from '../../../@types/router.js';
import {
  createPathResolver,
  createUrl,
  fetchMiddleware,
  fetchRoute,
  getFileSegments,
  isHTTPVerb,
  isValidExt,
  isValidName,
} from '../../../utils/utils.js';
import { BootstrapConfig, RequestHandler } from '../../../@types/server.js';
import { FSRoute, FSRoutes } from './types.js';

function routesRefiner(routes: FSRoutes) {
  for (const url in routes) {
    if (url.includes('@')) {
      const segments = url.split('/');
      if (segments.at(-1)?.startsWith('@')) {
        delete routes[url];
        continue;
      }
      const filteredSegments = segments.filter((segment) => !segment.startsWith('@'));
      const finalSegments = filteredSegments.map((segment) =>
        segment.replace(/^.*?([^@/]+).*?$/, '$1')
      );

      const newUrl = `/${path.posix.join(...finalSegments)}`;

      routes[newUrl] = routes[url];
      delete routes[url];
    }
  }
  return routes;
}

export function routeMatcher(routes: FSRoutes): RouteMatcher {
  return (pathname: string) => {
    let routeMatch: RouteMatch | null = null;

    if (routes[pathname]) {
      const route = routes[pathname];
      return {
        route: routes[pathname],
        params: {},
        getVerbModule(verb: HTTPVerb) {
          return route[verb] ?? null;
        },
        getVerbMiddlewares(verb: HTTPVerb) {
          return [route.middlewares || [], route[verb]?.middlewares || []].flat();
        },
      };
    }

    for (const routePath in routes) {
      const result = match(routePath)(pathname);
      if (result) {
        const route = routes[routePath];
        routeMatch = {
          params: result.params as Record<string, string>,
          getVerbModule(verb: HTTPVerb) {
            return route[verb] ?? null;
          },
          getVerbMiddlewares(verb: HTTPVerb) {
            return [route.middlewares || [], route[verb]?.middlewares || []].flat();
          },
        };
        break;
      }
    }

    return routeMatch;
  };
}

export async function routesGenerator(baseUrl: string) {
  const routes: FSRoutes = {};
  const middlewares: RequestHandler[] = [];
  const routesResolver = createPathResolver(baseUrl);

  async function readDir(dirModules: string[]) {
    const dirPath = routesResolver(...dirModules);
    const url = createUrl(dirModules);
    const route: FSRoute = (routes[url] = {});

    const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
    const pendingDirReads: string[] = [];
    let shouldPopMiddleware = false;
    for (const dirEntry of dirEntries) {
      if (dirEntry.isDirectory() && isValidName(dirEntry.name))
        pendingDirReads.push(dirEntry.name);
      if (!dirEntry.isFile()) continue;
      const { name, extname } = getFileSegments(dirEntry.name);
      if (!isValidName(name) || !isValidExt(extname)) continue;

      const verb = name.slice(1, -1);

      if (isHTTPVerb(verb)) {
        const modulePath = path.join(dirPath, dirEntry.name);
        const module = await fetchRoute(modulePath);
        const verbHandler: HTTPVerbModule = (route[verb] = {});

        if (typeof module.default === 'function') {
          verbHandler.default = module.default;
        }
        if (Array.isArray(module.middlewares)) {
          verbHandler.middlewares = module.middlewares;
        }
      }

      if (verb === 'middleware') {
        const modulePath = path.join(dirPath, dirEntry.name);
        const module = await fetchMiddleware(modulePath);
        if (typeof module.default === 'function') {
          middlewares.push(module.default);
          shouldPopMiddleware = true;
        }
      }
    }

    if (middlewares.length > 0) route.middlewares = [...middlewares];

    for (const pendingDirRead of pendingDirReads) {
      await readDir([...dirModules, pendingDirRead]);
    }

    return shouldPopMiddleware && middlewares.pop();
  }
  await readDir(['/']);

  return routesRefiner(routes);
}

export async function createFSRouter(
  baseUrl: string
): Promise<BootstrapConfig['router']> {
  let routes: FSRoutes = await routesGenerator(baseUrl);

  return {
    match: routeMatcher(routes),
  };
}
