import { Interceptor, Router } from './routes.js';

export type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
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
