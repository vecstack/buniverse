import { RequestHandler } from './server.js';

export enum HTTPVerb {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export type HTTPVerbModule = {
  default?: RequestHandler;
  middlewares?: RequestHandler[];
};

export type MiddlewareModule = {
  default?: RequestHandler;
};

export type RouteMatch = {
  params: Record<string, string>;
  getVerbModule(verb: HTTPVerb): HTTPVerbModule | null;
  getVerbMiddlewares(verb: HTTPVerb): RequestHandler[];
};

export type RouteMatcher = (pathname: string) => RouteMatch | null;

export type Router = {
  match: RouteMatcher;
};
