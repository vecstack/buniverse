import { Interceptor, Routes } from './routes.js';

export type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
};
export interface BootstrapConfig {
  publicDir: string;
  port?: number;
  router: () => Routes | Promise<Routes>;
}

export interface PluginConfig {
  onRequest?: Interceptor<Request>;
  onResponse?: Interceptor<Response>;
}
