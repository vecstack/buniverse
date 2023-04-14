import { Interceptor, Route, Routes } from './routes.js';

export type GlobalContext = {
  request: Request | null;
  requestParams: Record<string, string>;
};
export interface BootstrapConfig {
  publicDir: string;
  port?: number;
  router: {
    match: (pathname: string) => {
      route: Route,
      params: Record<string, string>
    } | null
  };
}

export interface PluginConfig {
  onRequest?: Interceptor<Request>;
  onResponse?: Interceptor<Response>;
}
