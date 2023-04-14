import useParams from './src/packages/hooks/useParams.js';
import useRequest from './src/packages/hooks/useRequest.js';
import { useSchema } from './src/packages/hooks/useSchema.js';
import { bootstrap, install } from './src/server.js';

const Buniverse = {
  bootstrap,
  install,
  useParams,
  useRequest,
  useSchema
};


export { bootstrap, install, useParams, useRequest, useSchema };
export type { Handler } from './src/types/routes.js';
export type { BootstrapConfig, PluginConfig } from './src/types/server.js';

export default Buniverse;
