export type RequestHandler = (arg: Request) => Response | React.ReactElement | void | Promise<Response | React.ReactElement | void>;

export enum HTTPVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type HTTPVerbModule = {
  handler: RequestHandler;
  middlewares?: RequestHandler[];
};

export type MiddlewareModule = {
  handler?: RequestHandler;
};

export type RouteMatch = {
  context?: Record<string, any>;
  getVerbModule(verb: HTTPVerb): HTTPVerbModule | null;
  getVerbMiddlewares(verb: HTTPVerb): RequestHandler[];
};

export type RouteMatcher = (pathname: string) => RouteMatch | null;

export type Router = {
  match: RouteMatcher;
  formatRoutes?(): Record<string, any>;
};
