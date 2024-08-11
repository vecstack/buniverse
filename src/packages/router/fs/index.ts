import { match } from 'path-to-regexp';
import path from 'path';
import fs from 'fs/promises';
import { createPathResolver, createUrl, fetchMiddleware, fetchRouteModule } from '../../../utils/utils.js';
import type { FSRoute, FSRoutes } from './types.js';
import { Glob } from 'bun';
import type { RouteMatch, RouteMatcher, HTTPVerb, RequestHandler, Router } from '../../../router-adapter.js';

function routesRefiner(routes: FSRoutes) {
  for (const url in routes) {
    if (url.includes('@')) {
      const segments = url.split('/');
      if (segments.at(-1)?.startsWith('@')) {
        delete routes[url];
        continue;
      }
      const filteredSegments = segments.filter((segment) => !segment.startsWith('@'));
      const finalSegments = filteredSegments.map((segment) => segment.replace(/^.*?([^@/]+).*?$/, '$1'));

      const newUrl = `/${path.posix.join(...finalSegments)}`;

      routes[newUrl] = routes[url];
      delete routes[url];
    }
  }
  return routes;
}

function routeMatcher(routes: FSRoutes): RouteMatcher {
  return (pathname: string) => {
    let routeMatch: RouteMatch | null = null;

    if (routes[pathname]) {
      const route = routes[pathname];
      return {
        route: routes[pathname],
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
          context: {
            params: result.params,
          },
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

const verbModuleGlob = new Glob('*.{get,post,patch,put,delete}.{js,jsx,ts,tsx}');
const middlewareModuleGlob = new Glob('*.middleware.{js,jsx,ts,tsx}');

async function routesGenerator(baseUrl: string) {
  const routes: FSRoutes = {};
  const middlewares: RequestHandler[] = [];
  const routesResolver = createPathResolver(baseUrl);

  async function readRoute(modules: string[]) {
    const routePath = routesResolver(...modules);
    const url = createUrl(modules);
    routes[url] = {};
    const route: FSRoute = routes[url];

    const routeEntries = await fs.readdir(routePath, { withFileTypes: true });
    const subroutes: string[] = [];
    let shouldPopMiddleware = false;

    for (const routeEntry of routeEntries) {
      // If it's a directory, push it to the submodules array so we can read it later
      if (routeEntry.isDirectory()) {
        subroutes.push(routeEntry.name);
      }

      // If it's not a file, skip it
      if (!routeEntry.isFile()) continue;

      if (verbModuleGlob.match(routeEntry.name)) {
        const verb = routeEntry.name.split('.').at(-2) as HTTPVerb;
        const modulePath = path.join(routePath, routeEntry.name);
        const module = await fetchRouteModule(modulePath);
        route[verb] = {};
        const verbHandler = route[verb];

        if (typeof module.default === 'function') {
          verbHandler.default = module.default;
        }
        if (Array.isArray(module.middlewares)) {
          verbHandler.middlewares = module.middlewares;
        }
      }

      if (middlewareModuleGlob.match(routeEntry.name)) {
        const modulePath = path.join(routePath, routeEntry.name);
        const module = await fetchMiddleware(modulePath);
        if (typeof module.default === 'function') {
          middlewares.push(module.default);
          shouldPopMiddleware = true;
        }
      }
    }

    if (middlewares.length > 0) route.middlewares = [...middlewares];

    for (const subroute of subroutes) {
      await readRoute([...modules, subroute]);
    }

    return shouldPopMiddleware && middlewares.pop();
  }
  await readRoute(['/']);

  return routesRefiner(routes);
}

export async function createFSRouter(baseUrl: string): Promise<Router> {
  let routes: FSRoutes = await routesGenerator(baseUrl);

  return {
    match: routeMatcher(routes),
  };
}

export { useParams } from './hooks.js';
