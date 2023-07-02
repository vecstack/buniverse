import { Router } from './router.js';

export type Interceptor<T> = (arg: T) => Response | void | Promise<Response | void>;

export type RequestHandler = Interceptor<Request>;

export type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string> | null;
};

export type Interceptors = {
  request: Interceptor<Request>[];
  response: Interceptor<Response>[];
};

export interface BootstrapConfig {
  publicDir: string;
  port?: number;
  router: Router;
}

export interface PluginConfig {
  onRequest?: Interceptor<Request>;
  onResponse?: Interceptor<Response>;
}
