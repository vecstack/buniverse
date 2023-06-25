import { Interceptor, Route, Routes } from './routes.js';

export type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
};

export type Interceptors = {
  request: Interceptor<Request>[];
  response: Interceptor<Response>[];
};

export type RouteMatcher = (pathname: string) => {
  route: Route;
  params: Record<string, string>;
} | null;
export interface BootstrapConfig {
  publicDir: string;
  port?: number;
  router: {
    match: RouteMatcher;
    routes: Routes;
  };
}

export interface PluginConfig {
  onRequest?: Interceptor<Request>;
  onResponse?: Interceptor<Response>;
}
