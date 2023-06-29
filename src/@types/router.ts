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

export type Route = Partial<Record<HTTPVerb, HTTPVerbModule>> & {
  middlewares?: RequestHandler[];
};

export type Routes = Record<string, Route>;

export type RouteMatch = {
  route: Route;
  params: Record<string, string>;
};

export type RouteMatcher = (pathname: string) => RouteMatch | null;

export type Router = {
  match: RouteMatcher;
  routes: Routes;
};
