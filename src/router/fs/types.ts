import type {
  HTTPVerb,
  HTTPVerbModule,
  RequestHandler,
} from '../../router/router-adapter';

export type FSRoute = Partial<Record<HTTPVerb, HTTPVerbModule>> & {
  middlewares?: RequestHandler[];
};

export type FSRoutes = Record<string, FSRoute>;
