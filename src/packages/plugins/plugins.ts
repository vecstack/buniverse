import { Interceptors, PluginConfig } from '../../@types/server.js';

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
