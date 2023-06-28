import { match } from 'path-to-regexp';
import path from 'path';
import fs from 'fs/promises';
import { RequestHandler, Route, HTTPVerbModule, Routes } from '../../../types/routes.js';
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
import { BootstrapConfig } from '../../../types/server.js';

function refineRoutes(routes: Routes) {
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

export function fsRouteMatcher(routes: Routes) {
  return (pathname: string) => {
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
  };
}

export async function FSRouterGenerator(baseUrl: string) {
  const routes: Routes = {};
  const middlewares: RequestHandler[] = [];
  const routesResolver = createPathResolver(baseUrl);

  async function readDir(dirModules: string[]) {
    const dirPath = routesResolver(...dirModules);
    const url = createUrl(dirModules);
    const route: Route = (routes[url] = {});

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

        if (typeof module.default === 'function') verbHandler.default = module.default;
        if (Array.isArray(module.middlewares))
          verbHandler.middlewares = module.middlewares;
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

  return refineRoutes(routes);
}

export async function FSRouter(baseUrl: string): Promise<BootstrapConfig['router']> {
  let routes: Routes = await FSRouterGenerator(baseUrl);

  return {
    match: fsRouteMatcher(routes),
    routes: routes,
  };
}
