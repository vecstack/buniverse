import useServerContext from './src/hooks/useContext.js';
import useRequest from './src/hooks/useRequest.js';
import { install } from './src/plugins/plugins.js';
import { bootstrap } from './src/server.js';

const Buniverse = {
  bootstrap,
  install,
  useRequest,
  useServerContext,
};

export { bootstrap, install, useRequest, useServerContext };
export type { BootstrapConfig } from './src/server.js';
export type { PluginConfig } from './src/plugins/plugins.js';
export type { RequestHandler } from './src/router-adapter.js';
export default Buniverse;
