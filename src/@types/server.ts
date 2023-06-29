import { Interceptor, Router } from './router.js';

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
