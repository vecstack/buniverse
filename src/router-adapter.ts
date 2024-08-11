export type Interceptor<T> = (arg: T) => Response | void | Promise<Response | void>;

export type RequestHandler = Interceptor<Request>;

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
  context?: Record<string, any>;
  getVerbModule(verb: HTTPVerb): HTTPVerbModule | null;
  getVerbMiddlewares(verb: HTTPVerb): RequestHandler[];
};

export type RouteMatcher = (pathname: string) => RouteMatch | null;

export type Router = {
  match: RouteMatcher;
};
