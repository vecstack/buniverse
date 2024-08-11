import type { Interceptor } from '../router-adapter.js';

export interface PluginConfig {
  onRequest?: Interceptor<Request>;
  onResponse?: Interceptor<Response>;
}

export type Interceptors = {
  request: Interceptor<Request>[];
  response: Interceptor<Response>[];
};

export const interceptors: Interceptors = {
  request: [],
  response: [],
};

export function install(pluginFn: () => PluginConfig) {
  const config = pluginFn();
  if (config.onRequest) {
    interceptors.request.push(config.onRequest);
  }
  if (config.onResponse) {
    interceptors.response.push(config.onResponse);
  }
}
