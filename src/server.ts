import { InterceptorManager } from './packages/interceptors/index.js';
import { interceptors } from './packages/plugins/plugins.js';
import { BootstrapConfig, GlobalContext } from './@types/server.js';
import { NotFound, enableDebugger, parseRequest } from './utils/utils.js';
import serveStatic from 'serve-static-bun';

export const globalContext: GlobalContext = {
  request: null,
  requestParams: null,
};

export async function bootstrap(config: BootstrapConfig) {
  const { port = 8080, router, publicDir } = config;

  async function handler(request: Request): Promise<Response> {
    enableDebugger(router);

    // Prepare global context for a new request
    globalContext.requestParams = null;
    globalContext.request = request;

    // Run request interceptors and throw if a response is returned
    await InterceptorManager.runThrowing(interceptors.request, request);

    // Get a route match for the current request
    const { pathname, verb } = parseRequest(request);
    const routeMatch = router.match(pathname);

    if (!routeMatch) {
      const response = await serveStatic(publicDir, { handleErrors: false })(request);
      if (response.status === 404) return NotFound();
      return response;
    }

    const verbModule = routeMatch.route[verb];
    if (!verbModule || !verbModule.default) return NotFound();

    const requestHandler = verbModule.default;
    globalContext.requestParams = routeMatch.params;

    const routeMiddlewares = InterceptorManager.getRouteMiddlewares(
      routeMatch.route,
      verb
    );

    const response =
      (await InterceptorManager.run(routeMiddlewares, request)) ||
      (await requestHandler(request)) ||
      NotFound();

    await InterceptorManager.runThrowing(interceptors.response, response);

    return response;
  }
  Bun.serve({
    async fetch(request) {
      try {
        return await handler(request);
      } catch (error) {
        if (error instanceof Response) return error;
        throw error;
      }
    },
    port,
  });
  console.log('Listening on localhost:' + port);
}
