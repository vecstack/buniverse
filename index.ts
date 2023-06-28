import useParams from './src/packages/hooks/useParams.js';
import useRequest from './src/packages/hooks/useRequest.js';
import { install } from './src/packages/plugins/plugins.js';
import { bootstrap } from './src/server.js';
const Buniverse = {
  bootstrap,
  install,
  useParams,
  useRequest,
};

export { bootstrap, install, useParams, useRequest };
export type { RequestHandler } from './src/types/routes.js';
export type { BootstrapConfig, PluginConfig } from './src/types/server.js';
export default Buniverse;
