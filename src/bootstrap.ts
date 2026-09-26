import { Server } from './server/server';
import type { Router } from './router/router-adapter';
import { Context } from './context/context';
import { HTTPVerb } from './router/router-adapter';

export interface BootstrapOptions {
  router: Router;
  publicDir?: string;
}

export async function bootstrap(
  options: BootstrapOptions,
): Promise<(request: Request) => Promise<Response>> {
  const { router } = options;
  const publicDir = options.publicDir || './public';

  return async function handler(request: Request): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    const verb = request.method.toUpperCase() as HTTPVerb;
    const routeMatch = router.match(pathname);
    const verbModule = routeMatch?.getVerbModule(verb);
    const verbMiddlewares = routeMatch?.getVerbMiddlewares(verb) || [];

    if (!routeMatch || !verbModule) {
      return Server.runStaticServer(request, publicDir);
    }

    return Context.run({ request, params: routeMatch.context || {} }, async () => {
      const middlewareResponse = await Server.runRequestHandlers(
        request,
        verbMiddlewares,
      );
      if (middlewareResponse) return middlewareResponse;

      const routeResponse = await Server.runRequestHandler(request, verbModule.handler);
      if (routeResponse) return routeResponse;

      return new Response('Not Found', { status: 404 });
    });
  };
}
