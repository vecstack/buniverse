import { HTTPVerb, HTTPVerbModule } from '../../../@types/router.js';
import { RequestHandler } from '../../../@types/server.js';

export type FSRoute = Partial<Record<HTTPVerb, HTTPVerbModule>> & {
  middlewares?: RequestHandler[];
};

export type FSRoutes = Record<string, FSRoute>;
